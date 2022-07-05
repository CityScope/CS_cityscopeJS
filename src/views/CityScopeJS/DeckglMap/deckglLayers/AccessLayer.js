import { HeatmapLayer } from "deck.gl";

export default function AccessLayer({ data, opacity }) {
  const accessData = data.access && data.access.features;
  const colors = [
    [233, 62, 58],
    [237, 104, 60],
    [243, 144, 63],
    [253, 199, 12],
    [255, 243, 59],
  ];
   return new HeatmapLayer({
     id: "ACCESS",
    colorRange: colors,
    intensity:  opacity ,
    threshold: 0.05,
    data: accessData && accessData,
    getPosition: (d) => d.geometry.coordinates,
    getWeight: (d) => d.properties[0],
    updateTriggers: {
      getWeight: [0],
    },
  });
}
