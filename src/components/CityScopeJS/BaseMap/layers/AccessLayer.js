import { HeatmapLayer } from "deck.gl";
import settings from "../../../../settings/settings.json";

export default function AccessLayer({ data, accessToggle }) {
    return new HeatmapLayer({
        id: "ACCESS",
        colorRange: settings.map.layers.heatmap.colors,
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
