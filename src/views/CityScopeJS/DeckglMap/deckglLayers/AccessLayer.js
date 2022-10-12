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
    debounceTimeout: 800,
    radiusPixels: opacity * 100,
    threshold: 0.5,
    data: accessData && accessData,
    getPosition: (d) => d.geometry.coordinates,
    // opacity: (d) => d.properties[Math.floor(opacity * 100)],
    updateTriggers: {
      radiusPixels: opacity,
    },
  });
}
