import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import {
  _proccessAccessData,
  _proccessGridData,
  _setupSunEffects,
  updateSunDirection,
} from '../../../../utils/utils'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import 'mapbox-gl/dist/mapbox-gl.css'
import settings from '../../../../settings/settings.json'
import {
  AccessLayer,
  AggregatedTripsLayer,
  ABMLayer,
  GridLayer,
} from './deckglLayers'

export default function PrjDeckGLMap(props) {
  const [viewState, setViewState] = useState(settings.map.initialViewState)
  const [access, setAccess] = useState(null)
  const [GEOGRID, setGEOGRID] = useState(null)
  const [ABM, setABM] = useState({})
  const effectsRef = useRef()
  const deckGL = useRef()
  const [cityioData] = useSelector((state) => [state.CITYIO])
  const viewSettings = useSelector((state) => state.UI_WEBSOCKET_DATA)

  useEffect(() => {
    if (!effectsRef.current) {
      return
    }
    updateSunDirection(props.viewSettings.time, effectsRef)
  }, [props.viewSettings])

  const _setViewStateToTableHeader = () => {
    const header = cityioData.GEOGRID.properties.header

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

  useEffect(() => {
    // fix deck view rotate
    _rightClickViewRotate()
    // setup sun effects
    _setupSunEffects(effectsRef, cityioData.GEOGRID.properties.header)

    // on init, check if prev. local storage with
    // view state exist. If so, load it.
    if (localStorage.getItem('deckGLviewState')) {
      console.log('loading prev. deckGLviewState...')
      let vs = localStorage.getItem('deckGLviewState')
      setViewState(JSON.parse(vs))
    } else {
      // zoom map on CS table location
      _setViewStateToTableHeader()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    effectsRef.current[0].shadowColor = [0, 0, 0, 1]
  }, [cityioData.GEOGRID.properties.header])

  useEffect(() => {
    setGEOGRID(_proccessGridData(cityioData))
    if (cityioData.access) {
      setAccess(_proccessAccessData(cityioData))
    }
    if (cityioData.ABM2) {
      setABM(cityioData.ABM2)
    }
  }, [cityioData])

  const onViewStateChange = ({ viewState }) => {
    //    save current view state to local sotrage
    localStorage.setItem('deckGLviewState', JSON.stringify(viewState))

    setViewState(viewState)
  }

  const _rightClickViewRotate = () => {
    document
      .getElementById('deckgl-wrapper')
      .addEventListener('contextmenu', (evt) => evt.preventDefault())
  }

  const layersKey = {
    ABM: ABMLayer({
      active: viewSettings.ABMLayer.active,
      data: ABM.trips,
      cityioData: cityioData,
      ABMmode: viewSettings.ABMLayer.ABMmode,
      zoomLevel: viewSettings.ABMLayer.zoomLevel,
      time: viewSettings.time,
    }),
    AGGREGATED_TRIPS: AggregatedTripsLayer({
      active: viewSettings.AggregatedTripsLayer.active,
      data: ABM.trips,
      cityioData: cityioData,
      ABMmode: viewSettings.AggregatedTripsLayer.ABMmode,
    }),
    GRID: GridLayer({
      active: viewSettings.GridLayer.active,
      data: GEOGRID,
    }),
    ACCESS: AccessLayer({
      active: viewSettings.AccessLayer.active,
      data: access,
      accessToggle: viewSettings.AccessLayer.accessToggle,
    }),
  }

  const layerOrder = ['ABM', 'AGGREGATED_TRIPS', 'GRID', 'ACCESS']

  const _renderLayers = () => {
    let layers = []
    for (var layer of layerOrder) {
      layers.push(layersKey[layer])
    }
    return layers
  }

  return (
    <DeckGL
      ref={deckGL}
      viewState={viewState}
      onViewStateChange={onViewStateChange}
      layers={_renderLayers()}
      effects={effectsRef.current}
      controller={{
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
  )
}
