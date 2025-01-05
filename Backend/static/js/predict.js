const predictionDisplay = document.getElementById("prediction-display");

async function fetchPrediction() {
  try {
    const response = await fetch("/api/predict", { method: "POST" });

    if (response.ok) {
      const data = await response.json();

      console.log("Data Prediksi:", data);

      if (data.prediction) {
        let predictionColor;
        switch (data.prediction) {
          case "Sangat Buruk":
            predictionColor = "red";
            break;
          case "Buruk":
            predictionColor = "orange";
            break;
          case "Cukup":
            predictionColor = "yellow";
            break;
          case "Baik":
            predictionColor = "green";
            break;
          case "Sangat Baik":
            predictionColor = "darkgreen";
            break;
          default:
            predictionColor = "black";
        }

        predictionDisplay.innerHTML = `
          <h2>Hasil Prediksi:</h2>
          <p style="color: ${predictionColor}; text-align: center; font-weight: 700; font-size: 2rem; margin-top: 4rem;">${data.prediction}</p>
        `;

        displayRecommendation(data.prediction);
      } else {
        predictionDisplay.innerHTML = `<p>Prediksi tidak tersedia.</p>`;
      }
    } else {
      predictionDisplay.innerHTML = `<p>Prediksi gagal. Status: ${response.status}</p>`;
    }
  } catch (error) {
    predictionDisplay.innerHTML = `<p>Gagal mengambil prediksi: ${error.message}</p>`;
  }
}

fetchPrediction();
setInterval(fetchPrediction, 1000);