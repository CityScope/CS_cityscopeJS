import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Switch,
  FormGroup,
  FormControlLabel,
  Typography,
} from "@mui/material/";

export const options = {
  plugins: {
    legend: {
      align: "center",
      position: "top",
      labels: {
        font: function (context) {
          var avgSize = Math.round(
            (context.chart.height + context.chart.width) / 2
          );
          var size = Math.round(avgSize / 50);
          return {
            size: size > 5 ? size : 5,
          };
        },
      },
    },

    tooltip: {
      callbacks: {
        label: (value) => {
          const name = value.label.slice(0, 10);
      
          const val = `${value.parsed.toFixed(4) || 0} km²`;

          return `${name}... ${val}`;
        },
      },
    },
    datalabels: {
      color: "#999999",
      formatter: function (value, context) {
        // calculate ratio of the value to the total sum of context.dataset.data
        const ratio = value / context.dataset.data.reduce((a, b) => a + b, 0);
        // up to 5 letters of the label
        const label = context.chart.data.labels[context.dataIndex].slice(0, 3);
        const area = value.toFixed(4);
        if (ratio < 0.2) {
          return "";
        } else {
          return `${label}... ${area} km²`;
        }
      },
      font: function (context) {
        var avgSize = Math.round(
          (context.chart.height + context.chart.width) / 2
        );
        var size = Math.round(avgSize / 50);

        return {
          size: size > 5 ? size : 0,
        };
      },
    },
  },
};

export default function AreaCalc() {
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [onlyInteractive, setOnlyInteractive] = useState(false);

  ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

  const createChartData = (geoGridData) => {
    const cellSize = cityIOdata?.GEOGRID?.properties?.header?.cellSize;
    // covert the cell size to square kilometers
    const squareQmPerCell = cellSize * cellSize * 0.000001;
    const data = {
      labels: [],
      datasets: [
        {
          label: "Area Calculation",
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
        },
      ],
    };

    geoGridData.forEach((gridCellData) => {
      // if the switch is on, only show interactive cells
      if (onlyInteractive && !gridCellData.interactive) return;

      let typeName = gridCellData.name;
      if (
        !typeName ||
        typeName === "None" ||
        typeName === "none" ||
        typeName === ""
      ) {
        typeName = "Unknown type...";
      }
      // check if this type is already in the array of labels
      // if it's already there, add the value to the data array at existing label
      if (data.labels.includes(typeName)) {
        const index = data.labels.indexOf(typeName);
        // check if the cell height val is an array of values [min,this, max]
        const floors = Array.isArray(gridCellData.height)
          ? // get the height val from the array of height values at the same index
            gridCellData.height[1]
          : gridCellData.height;
        // add the value to the data array at existing label
        if (floors !== 0) {
          data.datasets[0].data[index] =
            squareQmPerCell * floors * (data.datasets[0].data[index] + 1);
        } else {
          data.datasets[0].data[index] =
            squareQmPerCell * (data.datasets[0].data[index] + 1);
        }
      } else {
        //  if not, add it to the array of labels and add a new data point
        data.labels.push(typeName);
        data.datasets[0].data.push(0);
        data.datasets[0].backgroundColor.push(
          `rgba(${gridCellData.color[0]}, ${gridCellData.color[1]}, ${gridCellData.color[2]}, 0.2)`
        );
        data.datasets[0].borderColor.push(
          `rgba(${gridCellData.color[0]}, ${gridCellData.color[1]}, ${gridCellData.color[2]}, 0.8)`
        );
      }
    });
    setChartData(data);
  };

  useEffect(() => {
    if (!cityIOdata.GEOGRIDDATA) return;
    createChartData(cityIOdata.GEOGRIDDATA);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityIOdata, onlyInteractive]);

  // on change of the switch, update the chart data to only show interactive cells
  const handleSwitchChange = (event) => {
    setOnlyInteractive(event.target.checked);
  };

  return (
    <>
      {cityIOdata.GEOGRIDDATA && (
        <>
          <Doughnut data={chartData} options={options} />
          <FormGroup>
            <FormControlLabel
              control={<Switch onChange={handleSwitchChange} size="small" />}
              label={
                <Typography variant="caption" component="div">
                  {onlyInteractive
                    ? `display only interactive cells`
                    : `display all cells`}
                </Typography>
              }
            />
          </FormGroup>
        </>
      )}
    </>
  );
}
