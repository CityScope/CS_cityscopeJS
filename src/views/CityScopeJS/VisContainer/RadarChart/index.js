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

const options = {
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

const optionsNoData = {
  scales: {
    r: {
      angleLines: {
        color: "#363636",
      },
      grid: {
        color: "#363636",
        circular: true,
      },
      pointLabels: {
        color: "#363636",
      },
      ticks: {
        color: "#363636",
      },
    },
  },
};

const noData = {
  labels: [null, null, null],
  datasets: [
    {
      label: "No indicator data...",
      data: [null, null, null],
      backgroundColor: "#363636",
      borderColor: "#363636",
      borderWidth: 1,
    },
  ],
};

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
  const [radarData, setRadarData] = useState();

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

  useEffect(() => {
    if (!cityIOdata.indicators) {
      setRadarData(noData);
    } else {
      const d = createRadarData(cityIOdata.indicators);
      setRadarData(d);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityIOdata]);

  return (
    <>
      {radarData && (
        <Radar
          data={radarData}
          options={cityIOdata.indicators ? options : optionsNoData}
        />
      )}
    </>
  );
}
