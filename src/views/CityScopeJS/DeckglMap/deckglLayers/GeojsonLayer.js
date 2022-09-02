import { GeoJsonLayer } from "@deck.gl/layers";
import { hexToRgb } from "../../../../utils/utils";

export default function GeojsonLayer({ data: cityIOdata, opacity }) {
  if (cityIOdata.geojson) {
    return new GeoJsonLayer({
      id: "GeojsonLayer",
      data: cityIOdata.geojson,
      opacity: opacity,
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
        getFillColor: cityIOdata,
        getElevation: cityIOdata,
      },
      transitions: {
        getFillColor: 500,
        getElevation: 500,
      },
    });
  }
}
