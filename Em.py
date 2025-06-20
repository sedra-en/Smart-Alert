
from flask import Flask, render_template, request, flash, redirect, url_for, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import uuid
import tensorflow as tf
import numpy as np
import cv2
from collections import Counter
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline


# إعداد Flask والتخزين وSQLAlchemy
app = Flask(__name__)
app.secret_key = 'supersecretkey'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///smartalert.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {"connect_args": {"check_same_thread": False}}
app.config['UPLOAD_FOLDER'] = 'uploads'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(50), nullable=False)
    lastName = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    invite_token_id = db.Column(db.Integer, db.ForeignKey('invite_token.id'), nullable=True)

class InviteToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(100), unique=True, nullable=False)
    used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='invite_token_obj', uselist=False, foreign_keys=[User.invite_token_id])

# نماذج الذكاء الاصطناعي
model = tf.keras.models.load_model('model/frentmodel.h5')
class_names = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']

tokenizer = AutoTokenizer.from_pretrained("nlptown/bert-base-multilingual-uncased-sentiment")
text_model = AutoModelForSequenceClassification.from_pretrained("nlptown/bert-base-multilingual-uncased-sentiment")
sentiment_pipeline = pipeline("sentiment-analysis", model=text_model, tokenizer=tokenizer)

# بيانات الجلسة والمشاعر
alerts_data = []
emotion_counts = Counter({name: 0 for name in class_names})
feedback_data = []
last_detected_emotion = None

# مساعدة: تحليل الوجه
def detect_and_preprocess_face(image_path):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    img = cv2.imread(image_path)
    if img is None:
        return None
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    if len(faces) == 0:
        return None
    x, y, w, h = faces[0]
    face = gray[y:y+h, x:x+w]
    face_resized = cv2.resize(face, (48, 48))
    face_normalized = face_resized / 255.0
    face_input = face_normalized.reshape(1, 48, 48, 1)
    return face_input

# تحليل المشاعر للنص
def analyze_sentiment(text):
    result = sentiment_pipeline(text)[0]
    label = result['label']
    score = round(result['score'], 2)
    star_map = {
        "1 star": (1, "Very Negative"),
        "2 stars": (2, "Negative"),
        "3 stars": (3, "Neutral"),
        "4 stars": (4, "Positive"),
        "5 stars": (5, "Very Positive")
    }
    stars, sentiment = star_map.get(label, (0, "Unknown"))
    return {
        "stars": stars,
        "sentiment": sentiment,
        "confidence": score
    }

# صفحات المستخدمين
@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            session['user_name'] = user.firstName
            return redirect(url_for('welcome'))
        error = "Invalid email or password!"
        return render_template('login.html', error=error)
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        firstName = request.form.get('firstName')
        lastName = request.form.get('lastName')
        email = request.form.get('email')
        password = request.form.get('password')
        confirmPassword = request.form.get('confirmPassword')
        invite_token = request.form.get('invite_token')  # ✅ أخذ رمز الدعوة من الفورم

        if password != confirmPassword:
            error = "Passwords do not match!"
            return render_template('signup.html', error=error)

        if User.query.filter_by(email=email).first():
            error = "Email is already registered!"
            return render_template('signup.html', error=error)

        # ✅ التحقق من رمز الدعوة
        token_entry = InviteToken.query.filter_by(token=invite_token, used=False).first()
        if not token_entry:
            error = "رمز الدعوة غير صالح أو مستخدم مسبقًا!"
            return render_template('signup.html', error=error)

        hashed_password = generate_password_hash(password)
        new_user = User(firstName=firstName, lastName=lastName, email=email, password=hashed_password, invite_token_id=token_entry.id)
        # ✅ تعليم رمز الدعوة بأنه مستخدم
        token_entry.used = True
        token_entry.user = new_user
        db.session.add(new_user)

        db.session.commit()
        return redirect(url_for('login'))

    return render_template('signup.html')

  

@app.route('/welcome')
def welcome():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('welcome.html', user_name=session['user_name'])

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

# صفحات الذكاء الاصطناعي
@app.route('/submit')
def submit_page():
    return render_template('submit.html')

@app.route('/feedback')
def feedback_page():
    return render_template('feedback.html')

@app.route('/submit-feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    comment = data.get('feedback', '')
    result = analyze_sentiment(comment)
    feedback_data.append({
        "text": comment,
        "stars": result["stars"],
        "sentiment": result["sentiment"]
    })
    return jsonify(result)

@app.route('/feedback-data')
def get_feedback_data():
    return jsonify(feedback_data)
@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('dashboard.html', user_name=session['user_name'])

@app.route('/happiness-percentage')
def get_happiness_percentage():
    total = sum(emotion_counts.values()) or 1
    happy_count = emotion_counts['happy']
    percentage = round((happy_count / total) * 100, 2)
    return jsonify({"percentage": percentage})

@app.route('/upload', methods=['POST'])
def upload():
    global last_detected_emotion
    images = request.files.getlist('image')
    if not images:
        return jsonify({'status': 'error', 'message': 'No images uploaded'})

    results = []
    for image in images:
        if image:
            filename = secure_filename(image.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image.save(image_path)

            img_array = detect_and_preprocess_face(image_path)
            if img_array is None:
                results.append({
                    'filename': filename,
                    'status': 'error',
                    'message': 'No face detected'
                })
                continue

            prediction = model.predict(img_array)
            detected_emotion = class_names[np.argmax(prediction)]
            last_detected_emotion = detected_emotion.lower()
            emotion_counts[detected_emotion] += 1

            if detected_emotion in ['angry', 'fear', 'disgust', 'sad']:
                alerts_data.append({
                    'emotion': detected_emotion.capitalize(),
                    'time': datetime.now().strftime('%Y-%m-%d %H:%M'),
                    'type': 'negative'
                })

            results.append({
                'filename': filename,
                'status': 'success',
                'emotion': detected_emotion.capitalize(),
                'time': datetime.now().strftime('%H:%M:%S')
            })

    return jsonify({'results': results})

@app.route('/emotion-status')
def emotion_status():
    return render_template('emotion_status.html')

@app.route('/get-emotions')
def get_emotions():
    total = sum(emotion_counts.values()) or 1
    data = [
        {'name': name, 'value': round((emotion_counts[name] / total) * 100, 2)}
        for name in ['happy', 'neutral', 'angry', 'fear', 'disgust', 'surprise', 'sad']
    ]
    return jsonify({'emotions': data})

@app.route('/alerts')
def alerts():
    return render_template('alerts.html')

@app.route('/get-alerts')
def get_alerts():
    return jsonify({'alerts': alerts_data})

@app.route('/get-last-emotion')
def get_last_emotion():
    if last_detected_emotion:
        return jsonify({'emotion': last_detected_emotion})
    else:
        return jsonify({'emotion': None})
    
@app.route('/invite-tokens', methods=['GET'])
def invite_tokens():
    tokens = InviteToken.query.order_by(InviteToken.id.desc()).all()
    return render_template('generate_token.html', tokens=tokens)

@app.route('/generate-invite-token', methods=['POST'])
def generate_invite_token():
    new_token = str(uuid.uuid4())[:8]  # رموز قصيرة
    token = InviteToken(token=new_token, used=False)
    db.session.add(token)
    db.session.commit()
    return redirect(url_for('invite_tokens'))

@app.route('/token_password_modal', methods=['POST'])
def token_password_modal():
    password = request.form.get('password')
    if password == "2003":
        session['auth_for_tokens'] = True
        return jsonify({"success": True, "redirect_url": url_for('invite_tokens')})
    else:
        return jsonify({"success": False, "message": "Incorrect password"}), 401

# تشغيل التطبيق
if __name__ == '__main__':
     with app.app_context():
        db.create_all()
     app.run(debug=True)