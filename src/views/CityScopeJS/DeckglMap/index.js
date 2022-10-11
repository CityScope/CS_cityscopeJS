import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import PaintBrush from "./components/PaintBrush";
import { postToCityIO } from "../../../utils/utils";
import Map from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { mapSettings } from "../../../settings/settings";
import {
  AccessLayer,
  AggregatedTripsLayer,
  ABMLayer,
  GridLayer,
  TextualLayer,
  GeojsonLayer,
  // MeshLayer,
} from "./deckglLayers";
import { processGridData } from "./deckglLayers/GridLayer";

export default function DeckGLMap() {
  // get cityio data from redux store
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  // get menu state from redux store
  const menuState = useSelector((state) => state.menuState);
  const [draggingWhileEditing, setDraggingWhileEditing] = useState(false);
  const [selectedCellsState, setSelectedCellsState] = useState();
  const [viewState, setViewState] = useState();
  const [keyDownState, setKeyDownState] = useState();
  const [mousePos, setMousePos] = useState();
  const [mouseDown, setMouseDown] = useState();
  const [hoveredObj, setHoveredObj] = useState();
  const [GEOGRIDDATA, setGEOGRIDDATA] = useState();
  const deckGLref = useRef();
  const pickingRadius = 40;
  const editModeToggle = menuState.editMenuState.EDIT_BUTTON;
  const selectedType = menuState.typesMenuState.SELECTED_TYPE;
  const layersMenu = menuState.layersMenuState;
  const viewControlButton =
    menuState.viewSettingsMenuState.VIEW_CONTROL_BUTTONS;

  // ! constant animation speed for now - will be updated with slider

  const toggleAnimationState =
    menuState.viewSettingsMenuState.ANIMATION_CHECKBOX;
  const toggleRotateCamera = menuState.viewSettingsMenuState.ROTATE_CHECKBOX;

  const [animationTime, setAnimationTime] = useState(0);
  const [animation] = useState({});
  const animate = () => {
    if (toggleAnimationState && toggleAnimationState.isOn) {
      // use variable outside of closure to allow toggle
      setAnimationTime((t) => {
        return t > mapSettings.map.layers.ABM.endTime
          ? mapSettings.map.layers.ABM.startTime
          : t + toggleAnimationState.slider;
      });
      animation.id = window.requestAnimationFrame(animate); // draw next frame
    }
  };
  // ! self executing function to toggle animation state
  (function () {
    if (toggleAnimationState && !toggleAnimationState.isOn) {
      window.cancelAnimationFrame(animation.id);
      return;
    }
  })();

  useEffect(() => {
    animation.id = window.requestAnimationFrame(animate); // start animation
    return () => {
      window.cancelAnimationFrame(animation.id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleAnimationState]);

  // toggle camera rotation on and off
  useEffect(() => {
    if (toggleRotateCamera && toggleRotateCamera.isOn) {
      let bearing = viewState.bearing || 0;
      bearing < 360
        ? (bearing += (animationTime / 100000000) * toggleRotateCamera.slider)
        : (bearing = 0);
      setViewState({
        ...viewState,
        bearing: bearing,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleRotateCamera, animationTime]);

  const computeMidGridCell = () => {
    const lastCell =
      cityIOdata.GEOGRID.features[cityIOdata.GEOGRID.features.length - 1]
        .geometry.coordinates[0][0];
    const firstCell = cityIOdata.GEOGRID.features[0].geometry.coordinates[0][0];
    const midGrid = [
      (firstCell[0] + lastCell[0]) / 2,
      (firstCell[1] + lastCell[1]) / 2,
    ];
    return midGrid;
  };

  // **
  //  * resets the camera viewport
  //  * to cityIO header data
  //  * https://github.com/uber/deck.gl/blob/master/test/apps/viewport-transitions-flyTo/src/app.js
  //  *
  const setViewStateToTableHeader = () => {
    const header = cityIOdata.GEOGRID.properties.header;
    const midGrid = computeMidGridCell();
    return {
      ...viewState,
      longitude: midGrid[0],
      latitude: midGrid[1],
      zoom: 15,
      pitch: 45,
      bearing: 360 - header.rotation,
      orthographic: false,
    };
  };

  useEffect(() => {
    const header = cityIOdata.GEOGRID.properties.header;
    const midGrid = computeMidGridCell();

    switch (viewControlButton) {
      case "RESET_VIEW_BUTTON":
        setViewState((prevViewState) => ({
          ...prevViewState,
          longitude: midGrid[0],
          latitude: midGrid[1],
          pitch: 0,
          bearing: 0,
          orthographic: false,
        }));
        break;

      case "NORTH_VIEW_BUTTON":
        setViewState((prevViewState) => ({
          ...prevViewState,
          bearing: 360 - header.rotation,
        }));
        break;

      case "ORTHO_VIEW_BUTTON":
        setViewState((prevViewState) => ({
          ...prevViewState,
          orthographic: prevViewState.orthographic
            ? !prevViewState.orthographic
            : true,
        }));

        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewControlButton]);


  // fix deck view rotate
  useEffect(() => {
    document
      // ! a more aggressive method which prevents all right click context menu
      // .getElementById("deckgl-wrapper")
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
      zoomLevel: viewState && viewState.zoom && viewState.zoom,
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
      opacity:
        layersMenu &&
        layersMenu.GEOJSON_LAYER_CHECKBOX &&
        layersMenu.GEOJSON_LAYER_CHECKBOX.slider * 0.01,
    }),

    // MESH: MeshLayer({
    //   data: GEOGRIDDATA,
    //   opacity:
    //     layersMenu &&
    //     layersMenu.MESH_LAYER_CHECKBOX &&
    //     layersMenu.MESH_LAYER_CHECKBOX.slider * 0.01,
    // }),
  };

  const layerOrder = [
    "GRID",
    "TEXTUAL",
    // "MESH",
    "GEOJSON",
    "ACCESS",
    "AGGREGATED_TRIPS",
    "ABM",
  ];

  const renderDeckLayers = () => {
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
          initialViewState={setViewStateToTableHeader()}
          onViewStateChange={onViewStateChange}
          layers={renderDeckLayers()}
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
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            mapStyle={mapSettings.map.mapStyle.sat}
            preventStyleDiffing={true}
          />
        </DeckGL>
      </div>
    </>
  );
}
