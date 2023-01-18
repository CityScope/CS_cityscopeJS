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
  plugins: {
    // dont show data labels
    datalabels: {
      display: false,
    },
  },

  scales: {
    r: {
      ticks: {
        display: false,
      },
      angleLines: {
        color: "#696969",
      },
      suggestedMin: 0,
      suggestedMax: 1,
      grid: {
        color: "#696969",
        circular: true,
      },
      pointLabels: {
        color: "#bcbcbc",
        // reduce font size to fit labels
        font: function (context) {
          var avgSize = Math.round(
            (context.chart.height + context.chart.width) / 2
          );
          var size = Math.round(avgSize / 80);
          return {
            size: size > 5 ? size : 5,
          };
        }
       
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
          backgroundColor: "#42a4f573",
          borderColor: "#42a5f5",
          borderWidth: 1.5,
        },
        {
          label: "reference",
          data: [],
          backgroundColor: "#0b860081",
          borderColor: "#0b8600",
          borderWidth: 1.5,
        },
      ],
    };

    for (let i = 0; i < indicators.length; i++) {
      if (indicators[i].viz_type === "radar") {
        radarData.labels.push(indicators[i].name);
        radarData.datasets[0].data.push(indicators[i].value);
        radarData.datasets[0].label = cityIOdata?.tableName;
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
