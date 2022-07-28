import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import PaintBrush from "./components/PaintBrush";
import { postToCityIO } from "../../../utils/utils";
import Map from "react-map-gl";
import DeckGL from "@deck.gl/react";
import "mapbox-gl/dist/mapbox-gl.css";
import settings from "../../../settings/settings.json";
import AnimationComponent from "../../../Components/AnimationComponent";
// import { HeatmapLayer } from "deck.gl";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";

import {
  AccessLayer,
  AggregatedTripsLayer,
  ABMLayer,
  GridLayer,
  TextualLayer,
  GeojsonLayer,
} from "./deckglLayers";
import {
  AmbientLight,
  LightingEffect,
  _SunLight as SunLight,
} from "@deck.gl/core";
import { processGridData } from "./deckglLayers/GridLayer";

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});

const dirLight = new SunLight({
  timestamp: Date.UTC(2019, 7, 1, 22),
  color: [255, 255, 255],
  intensity: 1.0,
  _shadow: true,
});

export default function DeckGLMap() {
  const [effects] = useState(() => {
    const lightingEffect = new LightingEffect({ ambientLight, dirLight });
    lightingEffect.shadowColor = [0, 0, 0, 0.5];
    return [lightingEffect];
  });
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
  const [layers, setLayers] = useState([]);
  const deckGLref = useRef();
  const pickingRadius = 40;
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
    setGEOGRIDDATA(processGridData(cityIOdata));
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
      opacity:
        layersMenu &&
        layersMenu.TEXTUAL_LAYER_CHECKBOX &&
        layersMenu.TEXTUAL_LAYER_CHECKBOX.slider * 0.01,
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
    //   new HeatmapLayer({
    //     data: cityIOdata && cityIOdata.access && cityIOdata.access.features,
    //     colorRange: [
    //       [255, 255, 178],
    //       [254, 217, 118],
    //       [254, 178, 76],
    //       [253, 141, 60],
    //       [240, 59, 32],
    //       [189, 0, 38],
    //     ],
    //     threshold: 0.05,
    //     getPosition: (d) => d.geometry.coordinates,
    //     getWeight: (d) => d.properties[0],
    //     updateTriggers: {
    //       getWeight: [0],
    //     },
    //   }),
    // ];
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
    setLayers(layers);
  };

  return (
    <>
      <AnimationComponent getAnimationTime={getAnimationTime} />
      <div
        onKeyDown={(e) => {
          setKeyDownState(e.nativeEvent.key);
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
          layers={layers}
          effects={effects}
          controller={{
            touchZoom: true,
            touchRotate: true,
            dragPan: !draggingWhileEditing,
            dragRotate: !draggingWhileEditing,
            keyboard: false,
          }}
        >
          <Map
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
