import { HeatmapLayer } from 'deck.gl'
import settings from '../../../../settings/settings.json'

export default function AccessLayer({ data, accessToggle }) {
  return new HeatmapLayer({
    id: 'ACCESS',
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
  })

  //   return new ColumnLayer({
  //     id: 'column-layer',
  //     data,
  //     diskResolution: 12,
  //     radius: 20,
  //     extruded: true,
  //     pickable: true,
  //     elevationScale: 500,
  //     getPosition: (d) => d.coordinates,
  //     colorRange: settings.map.layers.heatmap.colors,
  //     // getFillColor: (d) => [48, 128, d.values[accessToggle] * 255, 255],
  //     getLineColor: [0, 0, 0],
  //     getElevation: (d) => d.values[accessToggle],
  //   })
}
