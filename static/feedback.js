const starRatings = [
  "Very Negative - ★",
  "Negative - ★★",
  "Neutral - ★★★",
  "Positive - ★★★★",
  "Very Positive - ★★★★★"
];

// رسم الرسم البياني
const chartData = {
  labels: ['Very Negative', 'Negative', 'Neutral', 'Positive', 'Very Positive'],
  datasets: [{
    label: 'Feedback Ratings (%)',
    data: [0, 0, 0, 0, 0],
    backgroundColor: ['#e74c3c', '#f1948a', '#f1c40f', '#2ecc71', '#27ae60'],
    borderWidth: 1
  }]
};

const ctx = document.getElementById('feedbackChart').getContext('2d');
const feedbackChart = new Chart(ctx, {
  type: 'bar',
  data: chartData,
  options: {
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  }
});

// تحديث التعليقات من السيرفر
function updateFeedbackComments() {
  fetch('/feedback-data')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("feedbackContainer");
      container.innerHTML = "";

      let starsCount = [0, 0, 0, 0, 0];

      data.forEach(entry => {
        const div = document.createElement("div");
        div.className = "feedback-box";
        div.innerHTML = 
          `<p>"${entry.text}"</p>
          <p class="sentiment">${starRatings[entry.stars - 1]}</p>`;
        container.prepend(div);

        if (entry.stars >= 1 && entry.stars <= 5) {
          starsCount[entry.stars - 1]++;
        }
      });

      // احسب النسب المئوية للرسم البياني
      const total = starsCount.reduce((a, b) => a + b, 0);
      const percent = total > 0 ? starsCount.map(x => Math.round((x / total) * 100)) : [0, 0, 0, 0, 0];
      feedbackChart.data.datasets[0].data = percent;
      feedbackChart.update();
    })
    .catch(err => console.error("Failed to fetch feedback data", err));
}

window.onload = () => {
  updateFeedbackComments();
  setInterval(updateFeedbackComments, 10000); // كل 10 ثواني
};