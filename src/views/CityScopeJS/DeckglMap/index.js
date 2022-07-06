import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import PaintBrush from "./components/PaintBrush";
import { postToCityIO } from "../../../utils/utils";
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import "mapbox-gl/dist/mapbox-gl.css";
import settings from "../../../settings/settings.json";
import AnimationComponent from "../../../Components/AnimationComponent";

import {
  AccessLayer,
  AggregatedTripsLayer,
  ABMLayer,
  GridLayer,
  TextualLayer,
  GeojsonLayer,
} from "./deckglLayers";
import { AmbientLight, DirectionalLight, LightingEffect } from "@deck.gl/core";
import { proccessGridData } from "./deckglLayers/GridLayer";

// create ambient light source
const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});
// create directional light source
const directionalLight = new DirectionalLight({
  color: [255, 255, 255],
  intensity: 1.0,
  direction: [1, 1, -1],
  _shadow: true,
});
const lightingEffect = new LightingEffect({
  ambientLight,
  directionalLight,
});
lightingEffect.shadowColor = [0, 0, 0, 1];

export default function DeckGLMap() {
  // get cityio data from redux store
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);

  // get menu state from redux store
  const menuState = useSelector((state) => state.menuState);

  const [draggingWhileEditing, setDraggingWhileEditing] = useState(false);
  const [selectedCellsState, setSelectedCellsState] = useState();
  const [viewState, setViewState] = useState(settings.map.initialViewState);
  const [keyDownState, setKeyDownState] = useState();
  const [mousePos, setMousePos] = useState();
  const [mouseDown, setMouseDown] = useState();
  const [hoveredObj, setHoveredObj] = useState();
  const [GEOGRIDDATA, setGEOGRIDDATA] = useState();
  const deckGLref = useRef();
  const pickingRadius = 40;
  const shadowsToggle = menuState.viewSettingsMenuState.SHADOWS_CHECKBOX;
  const editModeToggle = menuState.editMenuState.EDIT_BUTTON;
  const selectedType = menuState.typesMenuState.SELECTED_TYPE;
  const layersMenu = menuState.layersMenuState;
  const viewControlButton =
    menuState.viewSettingsMenuState.VIEW_CONTROL_BUTTONS;
  const [animationTime, getAnimationTime] = useState(0);
  // /**
  //  * resets the camera viewport
  //  * to cityIO header data
  //  * https://github.com/uber/deck.gl/blob/master/test/apps/viewport-transitions-flyTo/src/app.js
  //  */

  const setViewStateToTableHeader = (viewControlButton) => {
    const lastCell =
      cityIOdata.GEOGRID.features[cityIOdata.GEOGRID.features.length - 1]
        .geometry.coordinates[0][0];
    const firstCell = cityIOdata.GEOGRID.features[0].geometry.coordinates[0][0];
    const midGrid = [
      (firstCell[0] + lastCell[0]) / 2,
      (firstCell[1] + lastCell[1]) / 2,
    ];
    const header = cityIOdata.GEOGRID.properties.header;
    setViewState({
      ...viewState,
      longitude: midGrid[0],
      latitude: midGrid[1],
      zoom: viewControlButton === "RESET_VIEW_BUTTON" ? 12 : viewState.zoom,
      pitch: 0,
      bearing:
        viewControlButton === "NORTH_VIEW_BUTTON" ? 0 : 360 - header.rotation,
      orthographic: viewControlButton === "ORTHO_VIEW_BUTTON" ? true : false,
    });
  };

  useEffect(() => {
    setViewStateToTableHeader(viewControlButton);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewControlButton]);

  // fix deck view rotate
  useEffect(() => {
    document
      .getElementById("deckgl-wrapper")
      .addEventListener("contextmenu", (evt) => evt.preventDefault());
    // zoom map on CS table location
    setViewStateToTableHeader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update the grid layer with every change to GEOGRIDDATA
  useEffect(() => {
    setGEOGRIDDATA(proccessGridData(cityIOdata));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityIOdata.GEOGRIDDATA]);

  // post GEOGRIDDATA changes to cityIO
  useEffect(() => {
    if (!editModeToggle && GEOGRIDDATA) {
      let dataProps = [];
      for (let i = 0; i < GEOGRIDDATA.features.length; i++) {
        dataProps[i] = GEOGRIDDATA.features[i].properties;
      }
      postToCityIO(dataProps, cityIOdata.tableName, "/GEOGRIDDATA/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editModeToggle]);

  const onViewStateChange = ({ viewState }) => {
    viewState.orthographic =
      viewControlButton === "ORTHO_VIEW_BUTTON" ? true : false;
    setViewState(viewState);
  };

  const layersKey = {
    ABM: ABMLayer({
      data: cityIOdata,
      ABMmode: 0,
      zoomLevel: viewState.zoom,
      time: animationTime,
      opacity:
        layersMenu &&
        layersMenu.ABM_LAYER_CHECKBOX &&
        layersMenu.ABM_LAYER_CHECKBOX.slider * 0.01,
    }),
    AGGREGATED_TRIPS: AggregatedTripsLayer({
      data: cityIOdata,
      ABMmode: 0,
      opacity:
        layersMenu &&
        layersMenu.AGGREGATED_TRIPS_LAYER_CHECKBOX &&
        layersMenu.AGGREGATED_TRIPS_LAYER_CHECKBOX.slider * 0.01,
    }),
    GRID: GridLayer({
      data: GEOGRIDDATA,
      editOn: editModeToggle,
      state: {
        selectedType,
        keyDownState,
        selectedCellsState,
        pickingRadius,
        opacity:
          layersMenu &&
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
      data: cityIOdata,
      opacity:
        layersMenu &&
        layersMenu.ACCESS_LAYER_CHECKBOX &&
        layersMenu.ACCESS_LAYER_CHECKBOX.slider * 0.01,
    }),
    TEXTUAL: TextualLayer({
      data: cityIOdata,
      coordinates: GEOGRIDDATA && GEOGRIDDATA,
    }),

    GEOJSON: GeojsonLayer({
      data: cityIOdata,
    }),
  };

  const layerOrder = [
    "TEXTUAL",
    "ABM",
    "AGGREGATED_TRIPS",
    "ACCESS",
    "GEOJSON",
    "GRID",
  ];

  const renderDeckglLayers = () => {
    let layers = [];
    for (var layerNameString of layerOrder) {
      // toggle layers on and off
      if (
        layersMenu &&
        layersMenu[layerNameString + "_LAYER_CHECKBOX"] &&
        layersMenu[layerNameString + "_LAYER_CHECKBOX"].isOn
      ) {
        layers.push(layersKey[layerNameString]);
      }
    }
    return layers;
  };

  return (
    <>
      <div
        onKeyDown={(e) => {
          setKeyDownState(e.nativeEvent.key);
        }}
        onKeyUp={() => setKeyDownState(null)}
        onMouseMove={(e) => setMousePos(e.nativeEvent)}
        onMouseUp={() => setMouseDown(false)}
        onMouseDown={() => setMouseDown(true)}
      >
        {/* <AnimationComponent
          getAnimationTime={getAnimationTime}
          animationToggle={
            menuState.VISIBILTY_MENU &&
            menuState.VISIBILTY_MENU.ANIMATE_CHECKBOX &&
            menuState.VISIBILTY_MENU.ANIMATE_CHECKBOX.isOn
          }
        /> */}

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
    </>
  );
}
