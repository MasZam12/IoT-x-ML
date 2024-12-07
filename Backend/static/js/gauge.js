const chartDom = document.getElementById("gauge-chart");
const myChart = echarts.init(chartDom);

// Konfigurasi opsi chart
const option = {
  tooltip: {
    formatter: "{a} <br/>{b} : {c}",
  },
  series: [
    {
      type: "gauge",
      startAngle: 180,
      endAngle: 0,
      min: 0, // Nilai minimum
      max: 1200, // Nilai maksimum
      splitNumber: 6, // Membagi menjadi 6 segmen
      axisLine: {
        lineStyle: {
          width: 10, // Ketebalan garis luar gauge
          color: [
            [0.2, "#3CB371"], // Warna hijau (0-240)
            [0.4, "#FFD700"], // Warna kuning (240-480)
            [0.6, "#FF8C00"], // Warna oranye (480-720)
            [1, "#FF4500"], // Warna merah (720-1200)
          ],
        },
      },
      axisLabel: {
        distance: -60,
        fontSize: 14,
        color: "#000",
      },
      pointer: {
        length: "60%",
        width: 4,
      },
      title: {
        offsetCenter: [0, "-30%"], // Posisi judul (Light)
        fontSize: 14,
      },
      detail: {
        valueAnimation: true,
        formatter: "{value}",
        fontSize: 20,
        offsetCenter: [0, "50%"], // Posisi detail (angka utama)
      },
      center: ["50%", "60%"],
      data: [
        {
          value: 480, // Nilai default pointer
          name: "Light",
        },
      ],
    },
  ],
};

// Render chart
myChart.setOption(option);

// Fungsi untuk mengambil data light dan mengupdate gauge
async function fetchLightData() {
  try {
    const response = await fetch('/api/sensor/latest');
    const data = await response.json();

    if (data.error) {
      console.error('Error:', data.error);
      return;
    }

    const latestData = data.latest_data;

    // Update gauge chart untuk Light Intensity
    myChart.setOption({
      series: [{
        data: [{
          value: latestData.light, // Mengambil nilai light dari data terbaru
          name: 'Light'
        }]
      }]
    });

  } catch (error) {
    console.error('Error fetching light data:', error);
  }
}

// Panggil fungsi untuk mengambil data dan update gauge setiap 5 detik
fetchLightData();
setInterval(fetchLightData, 5000);
