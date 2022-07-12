import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

export default function AreaCalc() {
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  ChartJS.register(ArcElement, Tooltip, Legend);

  let geoGridData = cityIOdata.GEOGRIDDATA;

  const createChartData = () => {
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
      let typeName = gridCellData.name;
      if (!typeName || typeName === "None" || typeName === "") {
        typeName = "Unknown type...";
      }
      // check if this type is already in the array of labels (if not, add it)
      if (data.labels.includes(typeName)) {
        const index = data.labels.indexOf(typeName);
        // add the value to the data array at existing label
        data.datasets[0].data[index] =
          gridCellData.height && gridCellData.height !== 0
            ? data.datasets[0].data[index] + 1
            : data.datasets[0].data[index] + 1;
      } else {
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
    if (!cityIOdata.GEOGRID.properties) return;
    createChartData(cityIOdata);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityIOdata]);

  return <>{geoGridData && <Doughnut data={chartData} />}</>;
}
