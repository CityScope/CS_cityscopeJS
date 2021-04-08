import { ColumnLayer } from 'deck.gl'
import settings from '../../../../settings/settings.json'
import { useSelector } from 'react-redux'

export default function AccessLayer({ data, cellSize }) {
  // return new HeatmapLayer({
  //   id: 'ACCESS',
  //   colorRange: settings.map.layers.heatmap.colors,
  //   radiusPixels: 200,
  //   opacity: 0.5,
  //   threshold: 0.5,
  //   data,
  //   getPosition: (d) => d.coordinates,
  //   getWeight: (d) => d.values[accessToggle],
  //   updateTriggers: {
  //     getWeight: [accessToggle],
  //   },
  // })
  const accessToggle = useSelector((state) => [state.ACCESS_TOGGLE])
  return new ColumnLayer({
    id: 'column-layer',
    data,
    shadowEnabled: false,

    material: false,
    diskResolution: 12,
    radius: cellSize,
    extruded: true,
    pickable: true,
    elevationScale: 100,
    getPosition: (d) => d.coordinates,
    colorRange: settings.map.layers.heatmap.colors,
    getFillColor: (d) => [255 * d.values[accessToggle], 82, 120, 200],
    getLineColor: [0, 0, 0],
    getElevation: (d) => d.values[accessToggle],
    updateTriggers: {
      getElevation: [accessToggle],
      getFillColor: [accessToggle],
    },
    transitions: {
      getFillColor: 500,
      getElevation: 200,
    },
  })
}
