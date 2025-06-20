document.addEventListener('DOMContentLoaded', () => {
  fetch('/get-alerts')
    .then(response => response.json())
    .then(data => {
      const alerts = data.alerts;
      const alertsList = document.getElementById('alerts-list');
      alertsList.innerHTML = ''; // تفريغ القائمة قبل الإضافة

      if (alerts.length === 0) {
        alertsList.innerHTML = '<p>No alerts yet.</p>';
        return;
      }

      // عكس الترتيب ليظهر الأحدث أولاً
      alerts.reverse().forEach((alert, index) => {
        const card = document.createElement('div');
        card.classList.add('alert-card');

        if (alert.type === 'negative') {
          card.classList.add('negative');
        }

        // أضفنا كلاس خاص للتنبيه الأحدث
        if (index === 0) {
          card.classList.add('latest');
        }

        const icon = document.createElement('div');
        icon.classList.add('alert-icon');
        icon.innerHTML = '👤';

        const textDiv = document.createElement('div');
        textDiv.classList.add('alert-text');
        textDiv.innerHTML = 
          `<p><strong>Emotion Detected:</strong> ${alert.emotion}</p>
          <p>${alert.time}</p>`
        ;

        const warningIcon = document.createElement('div');
        warningIcon.classList.add('alert-warning');
        warningIcon.innerHTML = alert.type === 'negative' ? '⚠️' : '';

        const content = document.createElement('div');
        content.classList.add('alert-content');
        content.appendChild(icon);
        content.appendChild(textDiv);

        card.appendChild(content);
        card.appendChild(warningIcon);

        alertsList.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Failed to load alerts:', error);
      document.getElementById('alerts-list').innerHTML = '<p style="color:red;">Failed to load alerts.</p>';
    });
});