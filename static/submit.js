// رسم مخطط المشاعر
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

// ✅ تحديث نسبة السعادة من السيرفر (حسب مشاعر الوجوه فقط)
function updateHappinessFromServer() {
  fetch('/happiness-percentage')
    .then(response => response.json())
    .then(data => {
      const happyPercent = data.percentage;
      emotionChart.data.datasets[0].data[0] = happyPercent;
      const remaining = 100 - happyPercent;
      const equallyDivided = remaining / 4;
      for (let i = 1; i < 5; i++) {
        emotionChart.data.datasets[0].data[i] = equallyDivided;
      }
      emotionChart.update();
      document.getElementById('happyPercent').textContent = happyPercent + '%';
    })
    .catch(error => {
      console.error('Failed to fetch happiness percentage:', error);
    });
}

// ✅ استدعاء أول مرة وكل 30 ثانية
updateHappinessFromServer();
setInterval(updateHappinessFromServer, 30000);

// ✅ إرسال التعليق لتحليله عند الضغط على الزر
document.querySelector('.sub-btn').addEventListener('click', function () {
  const feedbackText = document.getElementById('feedback').value.trim();

  if (!feedbackText) {
    Swal.fire({
      icon: 'warning',
      title: 'Wait!',
      text: 'Please enter your feedback before submitting.',
    });
    return;
  }

  fetch('/submit-feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ feedback: feedbackText })
  })
  .then(response => response.json())
  .then(data => {
    Swal.fire({
      icon: 'success',
      title: 'Thank you!',
      text:` Feedback submitted with ${data.stars} stars (${data.sentiment})`
    });
    document.getElementById('feedback').value = '';
    updateHappinessFromServer(); // 🔁 تحديث المخطط بعد إرسال التعليق
  })
  .catch(error => {
    console.error('Error submitting feedback:', error);
    Swal.fire({
      icon: 'error',
      title: 'Oops!',
      text: 'There was an error submitting your feedback.'
    });
  });
})