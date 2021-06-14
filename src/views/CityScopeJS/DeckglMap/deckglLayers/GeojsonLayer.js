import { GeoJsonLayer } from "deck.gl";
import { hexToRgb } from "../../../../utils/utils";

export default function GeojsonLayer({ data }) {
  if (data.geojson)
    return new GeoJsonLayer({
      id: "GeojsonLayer",
      data: data,
      pickable: true,
      wireframe: false,
      stroked: true,
      filled: true,
      extruded: true,
      lineWidthScale: 1,
      getFillColor: (d) => hexToRgb(d.properties.fill),
      getLineColor: (d) => hexToRgb(d.properties.stroke),
      lineWidthMinPixels: 2,
      getElevation: (d) => d.properties.height,
      updateTriggers: {
        getFillColor: data,
        getElevation: data,
      },
      transitions: {
        getFillColor: 500,
        getElevation: 500,
      },
    });
}
