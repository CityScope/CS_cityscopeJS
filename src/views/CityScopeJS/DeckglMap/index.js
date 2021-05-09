import { useState, useEffect, useRef } from 'react'
import PaintBrush from './components/PaintBrush'
import {
  _proccessAccessData,
  _proccessGridData,
  _postMapEditsToCityIO,
  updateSunDirection,
  _setupSunEffects,
} from '../../../utils/utils'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import 'mapbox-gl/dist/mapbox-gl.css'
import settings from '../../../settings/settings.json'

import {
  AccessLayer,
  AggregatedTripsLayer,
  ABMLayer,
  GridLayer,
  TextualLayer,
  GeojsonLayer,
} from './deckglLayers'

export default function Map(props) {
  const { menuState, cityIOdata } = props

  const [draggingWhileEditing, setDraggingWhileEditing] = useState(false)
  const [selectedCellsState, setSelectedCellsState] = useState(null)
  const [viewState, setViewState] = useState(settings.map.initialViewState)
  const [keyDownState, setKeyDownState] = useState(null)
  const [mousePos, setMousePos] = useState(null)
  const [mouseDown, setMouseDown] = useState(null)
  const [hoveredObj, setHoveredObj] = useState(null)
  const [access, setAccess] = useState(null)
  const [textualData, setTextualData] = useState(null)

  const [geojsonData, setGeojsonData] = useState(null)

  const [GEOGRID, setGEOGRID] = useState(null)
  const [ABM, setABM] = useState({})
  const effectsRef = useRef()
  const deckGL = useRef()
  const pickingRadius = 40

  // ! temp
  const [animationTime, setAnimationTime] = useState(0)

  const ABMlayerToggle = menuState.ABM_LAYER_CHECKBOX
  const rotateCameraToggle = menuState.ROTATE_CHECKBOX
  const shadowsToggle = menuState.SHADOWS_CHECKBOX
  const editModeToggle = menuState.EDIT_BUTTON
  const resetViewButton = menuState.RESET_VIEW_BUTTON
  const selectedType = menuState.SELECTED_TYPE

  /** On init */
  useEffect(() => {
    // fix deck view rotate
    _rightClickViewRotate()
    // setup sun effects
    _setupSunEffects(effectsRef, cityIOdata.GEOGRID.properties.header)
    // zoom map on CS table location
    _setViewStateToTableHeader()
    // eslint-disable-next-line react-hooks/exhaustive-deps

    updateSunDirection(15000, effectsRef)
  }, [])

  useEffect(() => {
    let shadowColor = shadowsToggle ? [0, 0, 0, 0.5] : [0, 0, 0, 0]
    effectsRef.current[0].shadowColor = shadowColor
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shadowsToggle])

  useEffect(() => {
    setGEOGRID(_proccessGridData(cityIOdata))
    if (cityIOdata.access) {
      setAccess(_proccessAccessData(cityIOdata.access))
    }
    if (cityIOdata.textual) {
      setTextualData(cityIOdata.textual)
    }
    if (cityIOdata.ABM2) {
      setABM(cityIOdata.ABM2)
    }

    if (cityIOdata.geojson) {
      setGeojsonData(cityIOdata.geojson)
    }
  }, [cityIOdata])

  useEffect(() => {
    if (!editModeToggle && GEOGRID) {
      let dataProps = []

      for (let i = 0; i < GEOGRID.features.length; i++) {
        dataProps[i] = GEOGRID.features[i].properties
      }
      _postMapEditsToCityIO(dataProps, cityIOdata.tableName, '/GEOGRIDDATA')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editModeToggle])

  useEffect(() => {
    _setViewStateToTableHeader()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetViewButton])

  const onViewStateChange = ({ viewState }) => {
    setViewState(viewState)
  }

  // /**
  //  * resets the camera viewport
  //  * to cityIO header data
  //  * https://github.com/uber/deck.gl/blob/master/test/apps/viewport-transitions-flyTo/src/app.js
  //  */
  const _setViewStateToTableHeader = () => {
    const header = cityIOdata.GEOGRID.properties.header

    setViewState({
      ...viewState,
      longitude: header.longitude,
      latitude: header.latitude,
      zoom: 15,
      pitch: 0,
      bearing: 360 - header.rotation,
      orthographic: true,
    })
  }

  // /**
  //  * Description. fix deck issue
  //  * with rotate right botton
  //  */
  const _rightClickViewRotate = () => {
    document
      .getElementById('deckgl-wrapper')
      .addEventListener('contextmenu', (evt) => evt.preventDefault())
  }

  const layersKey = {
    ABM: ABMLayer({
      data: ABM.trips,
      cityIOdata,
      ABMmode: 0,
      zoomLevel: viewState.zoom,
      time: animationTime,
    }),
    AGGREGATED_TRIPS: AggregatedTripsLayer({
      data: ABM.trips,
      cityIOdata,
      ABMmode: 0,
    }),
    GRID: GridLayer({
      data: GEOGRID,
      editOn: editModeToggle,
      state: {
        selectedType,
        keyDownState,
        selectedCellsState,
        pickingRadius,
      },
      updaters: {
        setSelectedCellsState,
        setDraggingWhileEditing,
        setHoveredObj,
      },
      deckGL,
    }),
    ACCESS: AccessLayer({
      data: access,
      cellSize: cityIOdata.GEOGRID.properties.header.cellSize,
    }),
    TEXTUAL: TextualLayer({
      data: textualData && textualData,
      coordinates: GEOGRID,
    }),

    GEOJSON: GeojsonLayer({
      data: geojsonData && geojsonData,
    }),
  }

  const layerOrder = [
    'TEXTUAL',
    'ABM',
    'AGGREGATED_TRIPS',
    'GEOJSON',
    'GRID',
    'ACCESS',
  ]

  const _renderLayers = () => {
    let layers = []
    for (var layer of layerOrder) {
      // if (layer in menuState) {
      layers.push(layersKey[layer])
      // }
    }
    return layers
  }

  return (
    <div
      className="baseMap"
      onKeyDown={(e) => {
        setKeyDownState(e.nativeEvent.key)
      }}
      onKeyUp={() => setKeyDownState(null)}
      onMouseMove={(e) => setMousePos(e.nativeEvent)}
      onMouseUp={() => setMouseDown(false)}
      onMouseDown={() => setMouseDown(true)}
    >
      <PaintBrush
        editOn={editModeToggle}
        mousePos={mousePos}
        selectedType={selectedType}
        pickingRadius={pickingRadius}
        mouseDown={mouseDown}
        hoveredObj={hoveredObj}
      />

      <DeckGL
        ref={deckGL}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        layers={_renderLayers()}
        effects={effectsRef.current}
        controller={{
          touchZoom: true,
          touchRotate: true,
          dragPan: !draggingWhileEditing,
          dragRotate: !draggingWhileEditing,
          keyboard: false,
        }}
      >
        <StaticMap
          asyncRender={false}
          dragRotate={true}
          reuseMaps={true}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          mapStyle={settings.map.mapStyle.sat}
          preventStyleDiffing={true}
        />
      </DeckGL>
    </div>
  )
}
