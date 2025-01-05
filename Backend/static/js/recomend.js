const recommendationText = document.getElementById("recommendation-text");
console.log("Menampilkan rekomendasi untuk prediksi:", prediction);

function displayRecommendation(prediction) {
  console.log("Menampilkan rekomendasi untuk prediksi:", prediction);

  switch (prediction) {
    case "Sangat Buruk":
      recommendationText.innerHTML = `
        <ul style="list-style-type: none; padding-left: 0; padding-top: 2rem; text-align: center; font-weight: 500; font-size: 1.2rem;">
          <li>
            Segera tingkatkan kelembapan tanah dengan penyiraman intensif dan pastikan pencahayaan mencukupi.
          </li>
        </ul>`;
      break;
    case "Buruk":
      recommendationText.innerHTML = `
        <ul style="list-style-type: none; padding-left: 0; padding-top: 2rem; text-align: center; font-weight: 500; font-size: 1.2rem;">
          <li>
            Perbaiki salah satu parameter yang kurang (kelembapan atau cahaya) dengan pemupukan atau pengaturan lokasi.
          </li>
        </ul>`;
      break;
    case "Cukup":
      recommendationText.innerHTML = `
        <ul style="list-style-type: none; padding-left: 0; padding-top: 2rem; text-align: center; font-weight: 500; font-size: 1.2rem;">
          <li>Pertahankan kondisi dan lakukan pemantauan rutin.</li>
        </ul>`;
      break;
    case "Baik":
      recommendationText.innerHTML = `
        <ul style="list-style-type: none; padding-left: 0; padding-top: 2rem; text-align: center; font-weight: 500; font-size: 1.2rem;">
          <li>Tanaman dalam kondisi baik, terus rawat dengan pola pemeliharaan yang sama.</li>
        </ul>`;
      break;
    case "Sangat Baik":
      recommendationText.innerHTML = `
        <ul style="list-style-type: none; padding-left: 0; padding-top: 2rem; text-align: center; font-weight: 500; font-size: 1.2rem;">
          <li>Kondisi optimal. Tidak perlu intervensi besar, hanya pantau secara berkala.</li>
        </ul>`;
      break;
    default:
      recommendationText.innerHTML = `<p>Rekomendasi tidak tersedia untuk hasil ini.</p>`;
  }
}