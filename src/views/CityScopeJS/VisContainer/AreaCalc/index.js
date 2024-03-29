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
      display: true,
      position: "left",
      align: "center",
      textDirection: "ltr",

      labels: {
        usePointStyle: true,
        font: function (context) {
          var avgSize = Math.round(
            (context.chart.height + context.chart.width) / 2
          );
          var size = Math.round(avgSize / 40);
          return {
            size: size > 8 ? size : 8,
          };
        },
      },
    },

    tooltip: {
      callbacks: {
        label: (value) => {
          const name = value.label;
          const val = `${value.parsed.toFixed(0) || 0} m²`;
          const areaSqFt = `${Math.floor(value.parsed * 10.7639) || 0} ft²`;

          return `${name} [${val}] [${areaSqFt}]`;
        },
      },
    },
    datalabels: {
      anchor: "center", //start, center, end
      rotation: function (context) {
        const valuesBefore = context.dataset.data
          .slice(0, context.dataIndex)
          .reduce((a, b) => a + b, 0);
        const sum = context.dataset.data.reduce((a, b) => a + b, 0);
        const rotation =
          ((valuesBefore + context.dataset.data[context.dataIndex] / 2) / sum) *
          360;
        return rotation < 180 ? rotation - 90 : rotation + 90;
      },

      color: (context) => {
        const color = context.dataset.borderColor[context.dataIndex];
        return color;
      },

      formatter: (value, context) => {
        // up to 5 letters of the label
        const label = context.chart.data.labels[context.dataIndex].slice(0, 10);
        const area = value.toFixed(0);
        // add the area in millions of square feet
        const areaSqFt = Math.floor(area * 10.7639);
        return `${label}..\n${area} m² \n${areaSqFt} ft²`;
      },
      font: (context) => {
        var avgSize = Math.round(
          (context.chart.height + context.chart.width) / 2
        );
        var size = Math.round(avgSize / 80);

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
    const cellSquareMeters = cellSize * cellSize;

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

      const typeName = gridCellData.name;
      if (
        !typeName ||
        typeName === "None" ||
        typeName === "none" ||
        typeName === ""
      ) {
        // typeName = "Unknown type...";
        return;
      }

      // check if the cell height val is an array of values [min,this, max]
      const floors = Array.isArray(gridCellData.height)
        ? gridCellData.height[1]
        : // if not, just use the value
        gridCellData.height
        ? // if the value is undefined, set it to 0
          gridCellData.height
        : 0;

      // function to add the value to the data array at existing label
      const addAreaToExistingType = (typeName, floors, squareQmPerCell) => {
        const index = data.labels.indexOf(typeName);
        // add the value to the data array at existing label
        data.datasets[0].data[index] +=
          floors > 0 ? squareQmPerCell * floors : squareQmPerCell;
      };

      // check if this type is already in the array of labels
      // if it's already there, add the value to the data array at existing label
      if (data.labels.includes(typeName)) {
        addAreaToExistingType(typeName, floors, cellSquareMeters);
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
        addAreaToExistingType(typeName, floors, cellSquareMeters);
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
