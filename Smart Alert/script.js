function previewImage(event) {
  const input = event.target;
  const fileNameDisplay = document.getElementById('fileName');
  const preview = document.getElementById('preview');
  const emotionResult = document.getElementById('emotionResult');
  const imageTime = document.getElementById('imageTime');

  if (input.files && input.files[0]) {
    const fileName = input.files[0].name;
    fileNameDisplay.textContent = `Selected: ${fileName}`;

    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = 'block';

      const emotions = ['Happy', 'Neutral', 'Angry', 'Surprise', 'Fear', 'Disgust', 'Sad'];
      const detected = emotions[Math.floor(Math.random() * emotions.length)];
      emotionResult.innerHTML = `Detected Emotion: <strong>${detected}</strong>`;

      const now = new Date();
      const dateTime = now.toLocaleString();
      imageTime.innerText = `Uploaded at: ${dateTime}`;
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    fileNameDisplay.textContent = "No image selected";
    preview.style.display = 'none';
    emotionResult.innerHTML = '';
    imageTime.innerText = '';
  }
}
