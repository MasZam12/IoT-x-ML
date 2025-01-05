const ctx = document.getElementById('lightHumidityChart').getContext('2d');
const lightHumidityChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Light Intensity',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                fill: true,
            },
            {
                label: 'Humidity',
                data: [],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 2,
                fill: true,
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Light and Humidity Levels Over Time',
                font: {
                    size: 20,
                    width: 700,
                    color: '#000'
                },
                padding: {
                    top: 20
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                min: 0,
                max: 1200
            }
        }
    }
});

async function fetchAndUpdateChartData() {
    try {
        const response = await fetch('/api/sensor/latest');
        const data = await response.json();

        if (data.error) {
            console.error('Error:', data.error);
            return;
        }

        const latestData = data.latest_data;

        const light = latestData.light !== undefined && latestData.light !== null ? latestData.light : 0;
        const humidity = latestData.humidity !== undefined && latestData.humidity !== null ? latestData.humidity : 0;

        const currentTime = new Date().toLocaleTimeString();
        lightHumidityChart.data.labels.push(currentTime);
        lightHumidityChart.data.datasets[0].data.push(light);
        lightHumidityChart.data.datasets[1].data.push(humidity);

        if (lightHumidityChart.data.labels.length > 10) {
            lightHumidityChart.data.labels.shift();
            lightHumidityChart.data.datasets[0].data.shift();
            lightHumidityChart.data.datasets[1].data.shift();
        }

        lightHumidityChart.update();
        
    } catch (error) {
        console.error('Error fetching sensor data:', error);
    }
}

fetchAndUpdateChartData();
setInterval(fetchAndUpdateChartData, 1000);