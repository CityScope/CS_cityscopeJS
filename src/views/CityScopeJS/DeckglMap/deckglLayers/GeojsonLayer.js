import { GeoJsonLayer } from 'deck.gl'
import { hexToRgb } from '../../../../utils/utils'

export default function GeojsonLayer({ data }) {
  return new GeoJsonLayer({
    id: 'GeojsonLayer',
    data,
    pickable: true,
    wireframe: true,
    stroked: false,
    filled: true,
    extruded: true,
    lineWidthScale: 1,
    getFillColor: (d) => hexToRgb(d.properties.fill),
    getLineColor: (d) => hexToRgb(d.properties.stroke),
    lineWidthMinPixels: 2,
    getElevation: (d) => d.properties.height,
  })
}
