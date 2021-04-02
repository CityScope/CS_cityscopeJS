import { useEffect, useState } from 'react'
import { StaticMap, _MapContext } from 'react-map-gl'
import { DeckGL } from '@deck.gl/react'
import 'mapbox-gl/dist/mapbox-gl.css'
import { IconLayer } from '@deck.gl/layers'
import icon from './legoio.png'

import settings from '../../../settings/GridEditorSettings.json'

// * draggable pin https://github.com/visgl/react-map-gl/tree/6.1-release/examples/draggable-markers

export default function CityIOdeckGLmap(props) {
  const [markerInfo, setMarkerInfo] = useState([])

  const INIT_VIEW = {
    longitude: -71.060929,
    latitude: 42.3545259,
    zoom: 1,
    pitch: 0,
    bearing: 0,
  }
  const [, setViewport] = useState(INIT_VIEW)

  const layer = new IconLayer({
    id: 'icon-layer',
    data: markerInfo,
    pickable: true,
    iconAtlas: icon,
    iconMapping: {
      marker: { x: 0, y: 0, width: 768, height: 768, mask: false },
    },
    getIcon: (d) => 'marker',
    sizeScale: 15,
    getPosition: (d) => d.coordinates,
    getSize: (d) => 5,
  })

  useEffect(() => {
    document
      .getElementById('deckgl-wrapper')
      .addEventListener('contextmenu', (evt) => evt.preventDefault())

    let markersArr = []
    props.cityIOdata.forEach((table) => {
      markersArr.push({
        info: table.tableHeader,
        coordinates: [table.tableHeader.longitude, table.tableHeader.latitude],
      })
    })

    setMarkerInfo(markersArr)
  }, [props])

  return (
    <>
      <DeckGL
        layers={[layer]}
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
