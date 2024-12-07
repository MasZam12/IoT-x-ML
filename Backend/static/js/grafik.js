// Inisialisasi chart
const ctx = document.getElementById('lightHumidityChart').getContext('2d');
const lightHumidityChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Akan diupdate dengan waktu atau label
        datasets: [
            {
                label: 'Light Intensity',
                data: [], // Data akan diupdate dengan nilai light
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                fill: true,
            },
            {
                label: 'Humidity',
                data: [], // Data akan diupdate dengan nilai humidity
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
                text: 'Light and Humidity Levels Over Time'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Fungsi untuk mengambil data terbaru dari API dan update grafik
async function fetchAndUpdateChartData() {
    try {
        const response = await fetch('/api/sensor/latest');
        const data = await response.json();

        if (data.error) {
            console.error('Error:', data.error);
            return;
        }

        const latestData = data.latest_data;

        // Tambahkan data baru ke grafik
        const currentTime = new Date().toLocaleTimeString(); // Ambil waktu saat ini sebagai label

        // Tambahkan data light dan humidity ke grafik
        lightHumidityChart.data.labels.push(currentTime); // Menambah label waktu
        lightHumidityChart.data.datasets[0].data.push(latestData.light); // Menambah data light
        lightHumidityChart.data.datasets[1].data.push(latestData.humidity); // Menambah data humidity

        // Batasi data agar tidak terlalu panjang (misalnya hanya 10 data terakhir)
        if (lightHumidityChart.data.labels.length > 10) {
            lightHumidityChart.data.labels.shift();
            lightHumidityChart.data.datasets[0].data.shift();
            lightHumidityChart.data.datasets[1].data.shift();
        }

        // Update chart dengan data terbaru
        lightHumidityChart.update();
        
    } catch (error) {
        console.error('Error fetching sensor data:', error);
    }
}

// Panggil fungsi untuk mengambil data dan update chart setiap 5 detik
fetchAndUpdateChartData();
setInterval(fetchAndUpdateChartData, 5000); // Setiap 5 detik
