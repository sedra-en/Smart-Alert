const alerts = [
  {
    emotion: 'Angry',
    time: '2025-05-28 10:45',
    type: 'negative'
  },
  {
    emotion: 'Fear',
    time: '2025-05-28 11:05',
    type: 'negative'
  },
  {
    emotion: 'Happy',
    time: '2025-05-28 12:00',
    type: 'positive'
  }
];

const alertsList = document.getElementById('alerts-list');
const alertSound = document.getElementById('alertSound');

alerts.forEach(alert => {
  const card = document.createElement('div');
  card.classList.add('alert-card');

  if (alert.type === 'negative') {
    card.classList.add('negative');
    alertSound.play(); // تشغيل الصوت فقط عند المشاعر السلبية
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