import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

export default function RadarChart() {
  ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
  );

  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const [radarData, setRadarData] = useState(null);

  const createRadarData = (indicators) => {
    let radarData = {
      labels: [],
      datasets: [
        {
          label: "Project Values",
          data: [],
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
        {
          label: "Reference Values",
          data: [],
          backgroundColor: "rgba(0, 33, 132, 0.2)",
          borderColor: "rgba(0, 99, 255, 1)",
          borderWidth: 1,
        },
      ],
    };

    for (let i = 0; i < indicators.length; i++) {
      if (indicators[i].viz_type === "radar") {
        radarData.labels.push(indicators[i].name);
        radarData.datasets[0].data.push(indicators[i].value);
        radarData.datasets[1].data.push(indicators[i].ref_value);
      }
    }
    return radarData;
  };

  const options = {
    title: {
      display: true,
      text: "Chart Title",
    },
    scales: {
      r: {
        angleLines: {
          color: "#696969",
        },
        grid: {
          color: "#696969",
          circular: true,
        },
        pointLabels: {
          color: "#C0C0C0",
        },
        ticks: {
          color: "#696969",
        },
      },
    },
  };

  useEffect(() => {
    if (!cityIOdata.indicators) return;
    console.log("cityIOdata.indicators", cityIOdata.indicators);
    const d = createRadarData(cityIOdata.indicators);
    setRadarData(d);
  }, [cityIOdata]);

  return (
    radarData && (
      <>
        <Radar data={radarData} options={options} />
      </>
    )
  );
}
