function previewImage(event) {
  const file = event.target.files[0];
  const preview = document.getElementById('preview');
  const fileName = document.getElementById('fileName');
  const emotionResult = document.getElementById('emotionResult');
  const imageTime = document.getElementById('imageTime');

  if (file) {
    fileName.textContent = file.name;
    preview.src = URL.createObjectURL(file);
    preview.style.display = 'block';

    const now = new Date();
    imageTime.textContent = "Uploaded at: " + now.toLocaleTimeString();

    const emotions = ['Happy', 'Neutral', 'Angry', 'Surprise', 'Fear', 'Disgust'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];

    // شيل أي كلاس قبل ما نضيف
    emotionResult.classList.remove("emotion-alert");

    // أضف اللون والحركة لو المشاعر سلبية
    if (['Angry', 'Fear', 'Disgust'].includes(randomEmotion)) {
      emotionResult.classList.add("emotion-alert");
    }

    emotionResult.innerHTML = `Detected Emotion: <strong>${randomEmotion}</strong>`;
    emotionResult.style.display = 'block';

  } else {
    preview.style.display = 'none';
    fileName.textContent = "No image selected";
    emotionResult.style.display = 'none';
    imageTime.textContent = "";
  }
}