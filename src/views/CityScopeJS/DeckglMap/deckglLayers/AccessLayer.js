import { HeatmapLayer } from 'deck.gl'
import settings from '../../../../settings/settings.json'

export default function AccessLayer({ data }) {
  const accessData = data && data.features

  return new HeatmapLayer({
    id: 'ACCESS',
    colorRange: settings.map.layers.heatmap.colors,
    radiusPixels: 200,
    opacity: 0.5,
    threshold: 0.5,
    data: accessData && accessData,
    getPosition: (d) => d.geometry.coordinates,
    getWeight: (d) => d.properties[0],
    updateTriggers: {
      getWeight: [0],
    },
  })
}
