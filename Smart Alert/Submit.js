const ctx = document.getElementById('emotionChart').getContext('2d');

const emotionChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Happy', 'Sad', 'Angry', 'Surprised', 'Fearful'],
    datasets: [{
      data: [80, 5, 5, 5, 5],
      backgroundColor: [
        '#28a745', '#007bff', '#dc3545', '#ffc107', '#6f42c1'
      ],
      borderWidth: 1
    }]
  },
  options: {
    responsive: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});

function updateChartData() {
  const baseHappy = 70 + Math.floor(Math.random() * 11); // 70–80%
  const remaining = 100 - baseHappy;
  const otherEmotions = [0, 0, 0, 0];
  let sum = 0;

  for (let i = 0; i < 4; i++) {
    otherEmotions[i] = i < 3 ? Math.floor(Math.random() * (remaining - sum)) : remaining - sum;
    sum += otherEmotions[i];
  }

  emotionChart.data.datasets[0].data = [baseHappy, ...otherEmotions];
  emotionChart.update();

  document.getElementById('happyPercent').textContent = baseHappy + '%';
}

setInterval(updateChartData, 30000);
