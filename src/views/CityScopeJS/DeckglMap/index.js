import { useState, useEffect, useRef } from 'react'
import PaintBrush from './components/PaintBrush'
import { _postMapEditsToCityIO } from '../../../utils/utils'
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
import { AmbientLight, DirectionalLight, LightingEffect } from '@deck.gl/core'
import { _proccessGridData } from './deckglLayers/GridLayer'

// create ambient light source
const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
})
// create directional light source
const directionalLight = new DirectionalLight({
  color: [255, 255, 255],
  intensity: 1.0,
  direction: [1, 1, -1],
  _shadow: true,
})
const lightingEffect = new LightingEffect({
  ambientLight,
  directionalLight,
})
lightingEffect.shadowColor = [0, 0, 0, 0.5]

export default function Map(props) {
  const { menuState, cityIOdata } = props
  const [draggingWhileEditing, setDraggingWhileEditing] = useState(false)
  const [selectedCellsState, setSelectedCellsState] = useState()
  const [viewState, setViewState] = useState(settings.map.initialViewState)
  const [keyDownState, setKeyDownState] = useState()
  const [mousePos, setMousePos] = useState()
  const [mouseDown, setMouseDown] = useState()
  const [hoveredObj, setHoveredObj] = useState()
  const [GEOGRID, setGEOGRID] = useState()
  const deckGLref = useRef()
  const pickingRadius = 40
  const shadowsToggle = menuState.SHADOWS_CHECKBOX
  const editModeToggle = menuState.EDIT_BUTTON
  const resetViewButton = menuState.VISIBILTY_MENU.RESET_VIEW_BUTTON
  const selectedType = menuState.SELECTED_TYPE
  const layersMenu = menuState.LAYERS_MENU

  /** On init */
  useEffect(() => {
    // fix deck view rotate
    _rightClickViewRotate()
    // zoom map on CS table location
    _setViewStateToTableHeader()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * update the grid layer with every change to GEOGRIDDATA
   */
  useEffect(() => {
    setGEOGRID(_proccessGridData(cityIOdata))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityIOdata.GEOGRIDDATA])

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

  /**
   * resets the camera viewport
   * to cityIO header data
   * https://github.com/uber/deck.gl/blob/master/test/apps/viewport-transitions-flyTo/src/app.js
   */
  const _setViewStateToTableHeader = () => {
    const lastCell =
      cityIOdata.GEOGRID.features[cityIOdata.GEOGRID.features.length - 1]
        .geometry.coordinates[0][0]
    const firstCell = cityIOdata.GEOGRID.features[0].geometry.coordinates[0][0]
    const midGrid = [
      (firstCell[0] + lastCell[0]) / 2,
      (firstCell[1] + lastCell[1]) / 2,
    ]

    const header = cityIOdata.GEOGRID.properties.header
    setViewState({
      ...viewState,
      longitude: midGrid[0],
      latitude: midGrid[1],
      zoom: 14,
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
      data: cityIOdata,
      ABMmode: 0,
      zoomLevel: viewState.zoom,
      // ! temp
      time: 0,
    }),
    AGGREGATED_TRIPS: AggregatedTripsLayer({
      data: cityIOdata,
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
        opacity:
          layersMenu.GRID_LAYER_CHECKBOX &&
          layersMenu.GRID_LAYER_CHECKBOX.slider * 0.01,
      },
      updaters: {
        setSelectedCellsState,
        setDraggingWhileEditing,
        setHoveredObj,
      },
      deckGLref,
    }),
    ACCESS: AccessLayer({
      data: cityIOdata.access,
      opacity:
        layersMenu.ACCESS_LAYER_CHECKBOX &&
        layersMenu.ACCESS_LAYER_CHECKBOX.slider * 0.01,
    }),
    TEXTUAL: TextualLayer({
      data: cityIOdata.textual && cityIOdata.textual,
      coordinates: GEOGRID && GEOGRID,
    }),

    GEOJSON: GeojsonLayer({
      data: cityIOdata.geojson && cityIOdata.geojson,
    }),
  }

  const layerOrder = [
    'TEXTUAL',
    'ABM',
    'AGGREGATED_TRIPS',
    'ACCESS',
    'GEOJSON',
    'GRID',
  ]

  const renderDeckglLayers = () => {
    let layers = []
    for (var layerNameString of layerOrder) {
      // toggle layers on and off
      if (
        menuState.LAYERS_MENU[layerNameString + '_LAYER_CHECKBOX'] &&
        menuState.LAYERS_MENU[layerNameString + '_LAYER_CHECKBOX'].isOn
      ) {
        layers.push(layersKey[layerNameString])
      }
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
        ref={deckGLref}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        layers={renderDeckglLayers()}
        effects={shadowsToggle && [lightingEffect]}
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
