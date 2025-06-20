const emotions = [
  { name: "Happy", color: "#2ecc71" },
  { name: "Neutral", color: "#95a5a6" },
  { name: "Angry", color: "#e74c3c" },
  { name: "Fear", color: "#9b59b6" },
  { name: "Disgust", color: "#27ae60" },
  { name: "Surprise", color: "#f1c40f" }
];

const ctx = document.getElementById('emotionChart').getContext('2d');

let emotionChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: emotions.map(e => e.name),
    datasets: [{
      label: 'Detected Emotions (%)',
      data: [],
      backgroundColor: emotions.map(e => e.color)
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  }
});

// توليد بيانات وهمية عشوائية
function getRandomEmotions() {
  let values = [];
  let remaining = 100;
  for (let i = 0; i < emotions.length - 1; i++) {
    let value = Math.floor(Math.random() * (remaining / 2));
    values.push(value);
    remaining -= value;
  }
  values.push(remaining);
  values = values.sort(() => Math.random() - 0.5);
  return emotions.map((e, i) => ({ name: e.name, value: values[i] }));
}

// التحقق من وجود مشاعر سلبية
function checkForNegativeEmotion(emotionData) {
  const negative = ["Angry", "Fear", "Disgust"];
  const threshold = 20;

  const hasNegative = emotionData.some(e => negative.includes(e.name) && e.value >= threshold);
  const alertBox = document.getElementById("alertBox");

  if (hasNegative) {
    alertBox.style.display = "block";
    alertBox.innerText = "⚠️ Negative emotion detected!";
    setTimeout(() => {
      alertBox.style.display = "none";
    }, 3000);
  } else {
    alertBox.style.display = "none";
  }
}

// تحديث البيانات كل 5 ثواني
function updateChart() {
  const emotionData = getRandomEmotions();
  emotionChart.data.datasets[0].data = emotionData.map(e => e.value);
  emotionChart.update();
  checkForNegativeEmotion(emotionData);
}

// بدء التحديث التلقائي
updateChart();
setInterval(updateChart, 5000);