import { useEffect, useState } from 'react'
import { StaticMap, _MapContext } from 'react-map-gl'
import { DeckGL } from '@deck.gl/react'
import 'mapbox-gl/dist/mapbox-gl.css'
import { ArcLayer, IconLayer } from '@deck.gl/layers'
import icon from './legoio.png'

import settings from '../../../settings/GridEditorSettings.json'

// * draggable pin https://github.com/visgl/react-map-gl/tree/6.1-release/examples/draggable-markers

export default function CityIOdeckGLmap(props) {
  const [markerInfo, setMarkerInfo] = useState([])
  const [clicked, setClicked] = useState()
  const [hovered, setHovered] = useState()

  console.log(hovered)

  const INIT_VIEW = {
    longitude: -71.060929,
    latitude: 42.3545259,
    zoom: 2,
    pitch: 0,
    bearing: 0,
  }
  const [, setViewport] = useState(INIT_VIEW)

  const layers = [
    new ArcLayer({
      id: 'arc-layer',
      data: markerInfo,
      pickable: true,
      getWidth: 3,
      getSourcePosition: (d) => d.arcCoorinates.from,
      getTargetPosition: (d) => d.arcCoorinates.to,
      getSourceColor: (d) => [0, 0, 0],
      getTargetColor: (d) => [255, 82, 120],
    }),
    new IconLayer({
      id: 'icon-layer',
      data: markerInfo,
      pickable: true,
      iconAtlas: icon,
      onClick: (d) => setClicked(d),
      onHover: (d) => setHovered({ object: d, size: 50 }),
      iconMapping: {
        marker: { x: 0, y: 0, width: 768, height: 768, mask: false },
      },
      getIcon: (d) => 'marker',
      sizeScale: 1,
      getPosition: (d) => [d.arcCoorinates.to[0], d.arcCoorinates.to[1]],
      getSize: hovered ? hovered.size : 100,
    }),
  ]

  useEffect(() => {
    document
      .getElementById('deckgl-wrapper')
      .addEventListener('contextmenu', (evt) => evt.preventDefault())

    let markersArr = []
    props.cityIOdata.forEach((table) => {
      markersArr.push({
        info: table.tableHeader,
        arcCoorinates: {
          from: [table.tableHeader.longitude, table.tableHeader.latitude],
          to: [
            table.tableHeader.longitude + Math.random() * 2,
            table.tableHeader.latitude + Math.random() * 2,
          ],
        },
      })
    })

    setMarkerInfo(markersArr)
  }, [props])

  return (
    <>
      <DeckGL
        layers={layers}
        controller={true}
        initialViewState={INIT_VIEW}
        ContextProvider={_MapContext.Provider}
        getTooltip={({ object }) => {
          return object && object.info && object.info.tableName
        }}
      >
        <StaticMap
          reuseMaps
          onViewportChange={setViewport}
          preventStyleDiffing={true}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          mapStyle={settings.map.mapStyle.sat}
        />
      </DeckGL>
    </>
  )
}
