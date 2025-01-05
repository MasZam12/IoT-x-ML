const chartDom = document.getElementById("gauge-chart");
const myChart = echarts.init(chartDom);

const option = {
  tooltip: {
    formatter: "{a} <br/>{b} : {c}",
  },
  series: [
    {
      type: "gauge",
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 1200,
      splitNumber: 6,
      axisLine: {
        lineStyle: {
          width: 10,
          color: [
            [0.2, "#3CB371"],
            [0.4, "#FFD700"],
            [0.6, "#FF8C00"],
            [1, "#FF4500"],
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
        offsetCenter: [0, "-30%"],
        fontSize: 14,
      },
      detail: {
        valueAnimation: true,
        formatter: "{value}",
        fontSize: 20,
        offsetCenter: [0, "50%"],
      },
      center: ["50%", "60%"],
      data: [
        {
          value: 480,
          name: "Light",
        },
      ],
    },
  ],
};

myChart.setOption(option);

async function fetchLightData() {
  try {
    const response = await fetch('/api/sensor/latest');
    const data = await response.json();

    if (data.error) {
      console.error('Error:', data.error);
      return;
    }

    const latestData = data.latest_data;

    myChart.setOption({
      series: [{
        data: [{
          value: latestData.light,
          name: 'Light'
        }]
      }]
    });

  } catch (error) {
    console.error('Error fetching light data:', error);
  }
}

fetchLightData();
setInterval(fetchLightData, 1000);