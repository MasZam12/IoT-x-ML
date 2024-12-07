// Mengambil elemen dari HTML
const humidityBar = document.getElementById("humidity-bar");
const humidityValueDisplay = document.getElementById("humidity-value");

// Fungsi untuk mengambil data humidity dan mengupdate bar
async function fetchHumidityData() {
    try {
        const response = await fetch('/api/sensor/latest');
        const data = await response.json();

        if (data.error) {
            console.error('Error:', data.error);
            return;
        }

        const latestData = data.latest_data;

        // Update bar untuk Humidity
        humidityBar.style.width = `${latestData.humidity}%`;
        humidityValueDisplay.textContent = `${latestData.humidity}%`;

    } catch (error) {
        console.error('Error fetching humidity data:', error);
    }
}

// Panggil fungsi untuk mengambil data dan update bar setiap 5 detik
fetchHumidityData();
setInterval(fetchHumidityData, 5000);
