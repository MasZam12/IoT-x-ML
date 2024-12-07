// Ambil elemen yang akan menampilkan hasil prediksi
const predictionDisplay = document.getElementById("prediction-display");

async function fetchPrediction() {
  try {
    // Ambil data prediksi dari API predict
    const response = await fetch("/api/predict", {
      method: "POST",
    });

    if (response.ok) {
      const data = await response.json();

      // Tampilkan hasil prediksi
      if (data.prediction) {
        predictionDisplay.innerHTML = `
          <h2>Hasil Prediksi:</h2>
          <p><strong>Prediksi:</strong> ${data.prediction}</p>
        `;
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

// Panggil fungsi untuk mengambil prediksi
fetchPrediction();
setInterval(fetchPrediction, 5000);