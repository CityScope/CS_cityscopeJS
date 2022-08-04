import { HeatmapLayer } from "deck.gl";

export default function AccessLayer({ active, data, accessToggle }) {
  return new HeatmapLayer({
    visible: active,
    id: "ACCESS",
    radiusPixels: 200,
    opacity: 0.5,
    threshold: 0.5,
    data,
    getPosition: (d) => d.coordinates,
    getWeight: (d) => d.values[accessToggle],
    updateTriggers: {
      getWeight: [accessToggle],
    },
  });
}
