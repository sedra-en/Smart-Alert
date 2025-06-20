
const feedbackSamples = [
    { text: "Worst service ever", stars: 1 },
    { text: "Not good at all", stars: 2 },
    { text: "It's fine, nothing special", stars: 3 },
    { text: "Really enjoyed it", stars: 4 },
    { text: "Absolutely fantastic!", stars: 5 }
];

const starRatings = ["Very Negative - ★", "Negative - ★★", "Neutral - ★★★", "Positive - ★★★★", "Very Positive - ★★★★★"];

const chartData = {
    labels: ['Very Negative', 'Negative', 'Neutral', 'Positive', 'Very Positive'],
    datasets: [{
        label: 'Feedback Ratings (%)',
        data: [10, 20, 30, 25, 15],
        backgroundColor: [
            '#e74c3c',
            '#f1948a',
            '#f1c40f',
            '#2ecc71',
            '#27ae60'
        ],
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

function generateRandomData() {
    let values = [0, 0, 0, 0, 0];
    for (let i = 0; i < 10; i++) {
        let r = Math.floor(Math.random() * 5);
        values[r]++;
    }
    return values.map(v => v * 10);
}

function updateChartData() {
    feedbackChart.data.datasets[0].data = generateRandomData();
    feedbackChart.update();
}

function updateFeedbackComments() {
    const container = document.getElementById("feedbackContainer");
    container.innerHTML = "";
    for (let i = 0; i < 5; i++) {
        let sample = feedbackSamples[Math.floor(Math.random() * feedbackSamples.length)];
        const div = document.createElement("div");
        div.className = "feedback-box";
        div.innerHTML = `<p>"${sample.text}"</p><p class="sentiment">${starRatings[sample.stars - 1]}</p>`;
        container.appendChild(div);
    }
}

setInterval(() => {
    updateChartData();
    updateFeedbackComments();
}, 3000);

window.onload = updateFeedbackComments;
