import { useEffect, useState } from 'react'
import { StaticMap, _MapContext } from 'react-map-gl'
import { DeckGL } from '@deck.gl/react'
import { FlyToInterpolator } from 'deck.gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { ArcLayer, IconLayer, TextLayer } from '@deck.gl/layers'
import icon from './legoio.png'
import settings from '../../../settings/settings.json'
import SelectedTable from './SelectedTable'

// * draggable pin https://github.com/visgl/react-map-gl/tree/6.1-release/examples/draggable-markers

export default function CityIOdeckGLmap(props) {
  const [markerInfo, setMarkerInfo] = useState([])
  const [clicked, setClicked] = useState()
  const [zoom, setZoom] = useState()
  const INIT_VIEW = {
    longitude: -71.060929,
    latitude: 42.3545259,
    zoom: 1,
    pitch: 0,
    bearing: 0,
  }
  const [viewport, setViewport] = useState(INIT_VIEW)
  const [initialViewState, setInitialViewState] = useState(viewport)
  // boolean for hovering flag
  let isHovering = false

  useEffect(() => {
    document
      .getElementById('deckgl-wrapper')
      .addEventListener('contextmenu', (evt) => evt.preventDefault())

    let markersArr = []
    props.cityIOdata.forEach((table, index) => {
      markersArr.push({
        table: table.table,
        index: index,
        info: table.tableHeader,
        coord: {
          from: [table.tableHeader.longitude, table.tableHeader.latitude],
          to: [
            table.tableHeader.longitude + Math.random(),
            table.tableHeader.latitude + Math.random(),
            100000,
          ],
        },
      })
    })
    setMarkerInfo(markersArr)
  }, [props])

  const layers = [
    new ArcLayer({
      id: 'arc-layer',
      data: markerInfo,
      pickable: true,
      getWidth: 2,
      getSourcePosition: (d) => d.coord.from,
      getTargetPosition: (d) => d.coord.to,
      getSourceColor: (d) => [255, 82, 120],
      getTargetColor: (d) => [255, 255, 255],
    }),
    new TextLayer({
      id: 'text-layer',
      data: markerInfo,
      pickable: true,
      getPosition: (d) => d.coord.to,
      getText: (d) => (d.info.tableName ? d.info.tableName : 'no name...'),
      getColor: [255, 255, 255],
      getSize: zoom < 3 ? 0 : 20,
      getAngle: 0,
      getPixelOffset: [30, 0],
      getTextAnchor: 'start',
      getAlignmentBaseline: 'center',
    }),
    new IconLayer({
      id: 'icon-layer',
      data: markerInfo,
      pickable: true,
      iconAtlas: icon,
      onClick: (d) => {
        setInitialViewState({
          longitude: d.object.coord.to[0],
          latitude: d.object.coord.to[1],
          zoom: 8,
          pitch: 0,
          bearing: 0,
          transitionDuration: 1000,
          transitionInterpolator: new FlyToInterpolator(),
        })

        setClicked(d)
      },
      iconMapping: {
        marker: { x: 0, y: 0, width: 768, height: 768, mask: false },
      },
      getIcon: (d) => 'marker',
      sizeScale: 1,
      getSize: zoom < 5 ? 75 : 50,
      getPosition: (d) => [d.coord.to[0], d.coord.to[1], 100000],
    }),
  ]

  return (
    <>
      {clicked && clicked.object && <SelectedTable clicked={clicked} />}

      <DeckGL
        onHover={({ object }) => (isHovering = Boolean(object))}
        getCursor={({ isDragging }) =>
          isDragging ? 'grabbing' : isHovering ? 'crosshair' : 'grab'
        }
        layers={layers}
        controller={true}
        initialViewState={initialViewState}
        onViewportChange={setViewport}
        onViewStateChange={(d) => setZoom(d.viewState.zoom)}
        ContextProvider={_MapContext.Provider}
      >
        <StaticMap
          onViewportChange={setViewport}
          reuseMaps
          preventStyleDiffing={true}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          mapStyle={settings.map.mapStyle.sat}
        />
      </DeckGL>
    </>
  )
}
