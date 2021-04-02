import { GeoJsonLayer } from "deck.gl";

export default function GridLayer({ active, data }) {
    return new GeoJsonLayer({
        visible: active,
        id: "GRID",
        data,
        extruded: true,
        wireframe: true,
        lineWidthScale: 1,
        lineWidthMinPixels: 2,
        getElevation: (d) => d.properties.height,
        getFillColor: (d) => d.properties.color,

        transitions: {
            getFillColor: 500,
            getElevation: 500,
        },
    });
}
