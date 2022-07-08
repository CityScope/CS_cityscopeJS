import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function BarChart() {
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const [barChartData, setBarChartData] = useState({});

  useEffect(() => {
    if (!cityIOdata.indicators) return;
    const d = createBarChartData(cityIOdata.indicators);
    setBarChartData(d.barChartData);
  }, [cityIOdata]);

  const createBarChartData = (indicators) => {
    let dataArr = [];

    for (let i = 0; i < indicators.length; i++) {
      if (indicators[i].viz_type === "bar") {
        dataArr.push({
          x: indicators[i].name,
          y: indicators[i].value,
        });
      }
    }

    return {
      barChartData: dataArr,
    };
  };

  return <></>;
}
