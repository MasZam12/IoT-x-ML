const humidityBar = document.getElementById("humidity-bar");
const humidityValueDisplay = document.getElementById("humidity-value");

async function fetchHumidityData() {
    try {
        const response = await fetch('/api/sensor/latest');
        const data = await response.json();

        if (data.error) {
            console.error('Error:', data.error);
            return;
        }

        const latestData = data.latest_data;

        humidityBar.style.width = `${latestData.humidity}%`;
        humidityValueDisplay.textContent = `${latestData.humidity}%`;

    } catch (error) {
        console.error('Error fetching humidity data:', error);
    }
}

fetchHumidityData();
setInterval(fetchHumidityData, 1000);