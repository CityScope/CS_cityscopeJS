import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {

  plugins: {
    legend: {
      display: false,
    }
  },
  maintainAspectRatio: true,
  aspectRatio: 1,

  scales: {
    y: {
      suggestedMin: 0,
      suggestedMax: 1,

      grid: {
        color: "#414141",
      },
      pointLabels: {
        color: "#414141",
      },
      ticks: {
        color: "#414141",
      },
    },
  },
  responsive: true,
};

export const noData = {
  labels: ["no data..."],
  datasets: [
    {
      label: "No indicator data...",
      data: [0],
      backgroundColor: "#696969",
    },
  ],
};

export default function BarChart() {
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const [barChartData, setBarChartData] = useState();

  useEffect(() => {
    if (!cityIOdata.indicators) {
      setBarChartData(noData);
    } else {
      const d = createBarChartData(cityIOdata.indicators);
      setBarChartData(d);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityIOdata]);

  const createBarChartData = (indicators) => {
    let barChartData = {
      labels: [],
      datasets: [
        {
          label: "Chart Data",
          data: [],
          backgroundColor: "rgba(255, 99, 132, 0.3)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    };

    for (let i = 0; i < indicators.length; i++) {
      if (indicators[i].viz_type === "bar") {
        barChartData.labels.push(indicators[i].name);
        barChartData.datasets[0].data.push(indicators[i].value);
      }
    }
    return barChartData;
  };

  return (
    <>
      {barChartData && (
        <Bar options={options} data={barChartData ? barChartData : noData} />
      )}
    </>
  );
}
