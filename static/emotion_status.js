const emotions = [
  { name: "happy", color: "#2ecc71" },
  { name: "neutral", color: "#95a5a6" },
  { name: "angry", color: "#e74c3c" },
  { name: "fear", color: "#9b59b6" },
  { name: "disgust", color: "#27ae60" },
  { name: "surprise", color: "#f1c40f" },
  { name: "sad", color: "#5DADE2" }
];

const ctx = document.getElementById('emotionChart').getContext('2d');

let emotionChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: emotions.map(e => e.name.charAt(0).toUpperCase() + e.name.slice(1)),
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

async function fetchEmotionData() {
  try {
    const response = await fetch("/get-emotions");
    const data = await response.json();
    return data.emotions;
  } catch (error) {
    console.error("Error fetching emotions:", error);
    return [];
  }
}

function checkForNegativeEmotion(emotionData) {
  const negative = ["angry", "fear", "disgust", "sad"];
  const threshold = 20;
  const alertBox = document.getElementById("alertBox");

  console.log("Data from backend:", emotionData);  // للمراقبة

  const hasNegative = emotionData.some(e => negative.includes(e.name.toLowerCase()) && e.value >= threshold);

  if (hasNegative) {
    alertBox.classList.remove("hidden");
    alertBox.innerText = "⚠️ Negative Emotion Detected!";
    alertBox.style.backgroundColor = "#ff4d4d";
    alertBox.style.animation = "pulse 1s infinite";
    setTimeout(() => {
      alertBox.classList.add("hidden");
      alertBox.style.animation = "none";
    }, 3000);
  } else {
    alertBox.classList.add("hidden");
  }
  console.log("Negative check:", emotionData);
}

async function updateChart() {
  const emotionData = await fetchEmotionData();
  emotionChart.data.datasets[0].data = emotionData.map(e => e.value);
  emotionChart.update();

  // ✅ نعتمد فقط على آخر صورة
  await checkLastEmotionAlert();

  const now = new Date();
  document.getElementById("timeBox").textContent = "Time: " + now.toLocaleTimeString();
}

updateChart();
setInterval(() => updateChart(), 5000);

async function checkLastEmotionAlert() {
  try {
    const response = await fetch("/get-last-emotion");
    const data = await response.json();
    const lastEmotion = data.emotion;

    const negative = ["angry", "fear", "disgust", "sad"];
    const alertBox = document.getElementById("alertBox");

    if (lastEmotion && negative.includes(lastEmotion.toLowerCase())) {
      alertBox.classList.remove("hidden");
      alertBox.innerText = "⚠️ Negative Emotion Detected!";
      alertBox.style.backgroundColor = "#ff4d4d";
      alertBox.style.animation = "pulse 1s infinite";
      setTimeout(() => {
        alertBox.classList.add("hidden");
        alertBox.style.animation = "none";
      }, 3000);
    } else {
      alertBox.classList.add("hidden");
    }
  } catch (error) {
    console.error("Error checking last emotion:", error);
  }
}