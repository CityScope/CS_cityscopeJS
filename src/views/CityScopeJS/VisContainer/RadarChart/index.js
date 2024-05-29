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
    tooltip: {
      callbacks: {
        // display tooltip with indicator name, value and description (if available)
        label: (value) => {
          const val = `${(value.parsed.r * 100).toFixed(2) || 0}%`;
          // if no description is available, only show the value
          if (
            !value.dataset.descriptions ||
            value.dataset.descriptions[value.dataIndex] === undefined
          ) {
            return [`${val}`];
          }

          // also add description to the tooltip if available
          const description = value.dataset.descriptions[value.dataIndex];
          // if description is longer than 30 characters, split it into two lines
          if (description.length > 30) {
            const splitIndex = description.lastIndexOf(" ", 30);
            return [
              `${val}`,
              `${description.slice(0, splitIndex)}`,
              `${description.slice(splitIndex + 1)}`,
            ];
          }
          return [`${val}`, `${description}`];
        },
      },
    },

    datalabels: {
      display: false,
    },
  },

  scales: {
    r: {
      ticks: {
        display: false,
        backdropColor: 'rgba(0, 0, 0, 0)', // transparent background
      },
      angleLines: {
        color: "#696969",
      },
      suggestedMin: 0,
      suggestedMax: 1,
      grid: {
        color: "#959595",
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
            size: size > 8 ? size : 8,
          };
        },
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
        backdropColor: 'rgba(0, 0, 0, 0)', // transparent background
      },
    },
  },
};

const noData = {
  labels: [null, null, null],
  datasets: [
    {
      label: "Waiting for data...",
      data: [null, null, null],
      backgroundColor: "#00000000",
      borderColor: "#00000000",
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
          // add descriptions array to the dataset
          descriptions: [],
        },
        {
          label: "reference",
          data: [],
          backgroundColor: "#55555581",
          borderColor: "#b4b4b4",
          borderWidth: 1,
          // add descriptions array to the dataset
          descriptions: [],
        },
      ],
    };

    for (let i = 0; i < indicators.length; i++) {
      if (indicators[i].viz_type === "radar") {
        radarData.labels.push(indicators[i].name);
        radarData.datasets[0].data.push(indicators[i].value);
        radarData.datasets[0].label = cityIOdata?.tableName;

        // push description value to the array if available
        indicators[i].description
          ? radarData.datasets[0].descriptions.push(indicators[i].description)
          : radarData.datasets[0].descriptions.push("No description available");

        // push reference value to the array
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
