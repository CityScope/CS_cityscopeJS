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

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// const [radarData, setRadarData] = useState(null);

// const createRadarData = (indicators) => {
//   let r = {};
//   let f = {};
//   let domains = [];
//   for (let i = 0; i < indicators.length; i++) {
//     if (indicators[i].viz_type === "radar") {
//       r[indicators[i].name] = [indicators[i].value];
//       f[indicators[i].name] = [indicators[i].ref_value];
//       indicators[i].domain = [0, 1];
//       domains.push(indicators[i]);
//     }
//   }
//   return { radarData: [r, f], domains: domains };
// };

// useEffect(() => {
//   const d = createRadarData(props.cityioData.indicators);
//   setRadarData(d);
// }, [props]);

export const data = {
  labels: ["Thing 1", "Thing 2", "Thing 3", "Thing 4", "Thing 5", "Thing 6"],
  datasets: [
    {
      label: "# of Votes",
      data: [2, 9, 3, 5, 2, 3],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
  ],
};

export default function RadarChart() {
  return <Radar data={data} />;
}
