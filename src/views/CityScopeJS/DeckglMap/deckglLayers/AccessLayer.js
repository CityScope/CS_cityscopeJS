import { HeatmapLayer } from "deck.gl";

export default function AccessLayer({ data, intensity, selected }) {
  const accessData = data.access && data.access.features;

  const colors = [
    [255, 0, 0],
    [255, 167, 0],
    [255, 244, 0],
    [163, 255, 0],
    [44, 186, 0],
  ];
  return new HeatmapLayer({
    id: "ACCESS",
    colorRange: colors,
    debounceTimeout: 800,
    radiusPixels: intensity || 35,
    intensity: 1,
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
