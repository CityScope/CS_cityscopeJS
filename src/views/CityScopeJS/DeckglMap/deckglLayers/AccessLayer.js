import { HeatmapLayer } from "deck.gl";

export default function AccessLayer({ data, intensity, selected }) {
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
    radiusPixels: intensity || 35,
    intensity:  1,
    weightsTextureSize: 1024,
    threshold: 0.3,

    data: accessData && accessData,
    getPosition: (d) => d.geometry.coordinates,
    getWeight: (d) => d.properties[selected],
    updateTriggers: {
      getWeight: selected,
    },
  });
}
