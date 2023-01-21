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
import { numberToColorHsl } from "../../../../utils/utils";

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
    // format the tooltip to show the value as a percentage
    tooltip: {
      callbacks: {
        label: function (context) {
          const val = `${(context.parsed.y * 100).toFixed(2) || 0}%`;
          // if no description is available, only show the value
          if (
            !context.dataset.descriptions ||
            context.dataset.descriptions[context.dataIndex] === undefined
          ) {
            return [`${val}`];
          }
          // also add description to the tooltip if available
          const description = context.dataset.descriptions[context.dataIndex];
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

    legend: {
      display: false,
    },

    datalabels: {
      display: false,
    },
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
        format: {
          style: "percent",
        },
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
      // add descriptions array to the dataset
      datasets: [
        {
          descriptions: [],
          label: "Chart Data",
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
        },
      ],
    };

    for (let i = 0; i < indicators.length; i++) {
      if (indicators[i].viz_type === "bar") {
        barChartData.labels.push(indicators[i].name);
        barChartData.datasets[0].data.push(indicators[i].value);
        var rgb = numberToColorHsl(indicators[i].value, 0, 1);
        barChartData.datasets[0].backgroundColor.push(
          `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.5)`
        );
        barChartData.datasets[0].borderColor.push(
          `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`
        );

        // push description value to the array if available
        indicators[i].description
          ? barChartData.datasets[0].descriptions.push(
              indicators[i].description
            )
          : barChartData.datasets[0].descriptions.push(
              "No description available"
            );
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
