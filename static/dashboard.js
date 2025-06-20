function previewImage(event) {
  const file = event.target.files[0];
  const preview = document.getElementById('preview');
  const fileName = document.getElementById('fileName');
  const emotionResult = document.getElementById('emotionResult');
  const imageTime = document.getElementById('imageTime');
  const alertLink = document.getElementById('alertsLink');

  if (file) {
    fileName.textContent = file.name;
    preview.src = URL.createObjectURL(file);
    preview.style.display = 'block';

    const now = new Date();
    imageTime.textContent = "Uploaded at: " + now.toLocaleTimeString();

    const formData = new FormData();
    formData.append('image', file);

    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      const emotion = data.emotion;

      emotionResult.classList.remove("emotion-alert");
      alertLink.classList.remove("shake-alert", "red-alert");

      const negativeEmotions = ['angry', 'fear', 'disgust', 'sad'];

      if (negativeEmotions.includes(emotion.toLowerCase())) {
        emotionResult.classList.add("emotion-alert");
        alertLink.classList.add("shake-alert", "red-alert");
      }

      emotionResult.innerHTML =`Detected Emotion: <strong>${emotion}</strong>`;
      emotionResult.style.display = 'block';
    })
    .catch(error => {
      console.error('Error during emotion analysis:', error);
      emotionResult.innerHTML =`<span style="color:red">Error analyzing emotion.</span>`;
      emotionResult.style.display = 'block';
      alertLink.classList.remove("shake-alert", "red-alert");
    });
  } else {
    preview.style.display = 'none';
    fileName.textContent = "No image selected";
    emotionResult.style.display = 'none';
    imageTime.textContent = "";
    alertLink.classList.remove("shake-alert", "red-alert");
  }
}