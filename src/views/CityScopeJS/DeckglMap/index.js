import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PaintBrush from "../../../Components/PaintBrush";
import { LayerHoveredTooltip } from "../../../Components/LayerHoveredTooltip";
import { postToCityIO } from "../../../utils/utils";
import DeckglBase from "./DeckglBase";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  AccessLayer,
  AggregatedTripsLayer,
  ABMLayer,
  GridLayer,
  TextualLayer,
  GeojsonLayer,
  TileMapLayer,
  TrafficLayer,
} from "./deckglLayers";
import { processGridData } from "./deckglLayers/GridLayer";

export default function DeckGLMap() {
  // get cityio data from redux store
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  // get menu state from redux store
  const menuState = useSelector((state) => state.menuState);
  const [draggingWhileEditing, setDraggingWhileEditing] = useState(false);
  const [selectedCellsState, setSelectedCellsState] = useState();
  const [deckGLRef, setDeckGLRef] = useState(null);
  const [keyDownState, setKeyDownState] = useState();
  const [mousePos, setMousePos] = useState();
  const [mouseDown, setMouseDown] = useState();
  const [hoveredObj, setHoveredObj] = useState();
  const [GEOGRIDDATA, setGEOGRIDDATA] = useState();

  // sets data from all hovered objected currently in the viewport
  const [layerHoveredData, setLayerHoveredData] = useState();

  const pickingRadius = 40;
  const editModeToggle = menuState.editMenuState.EDIT_BUTTON;
  const selectedType = menuState.typesMenuState.SELECTED_TYPE;
  const layersMenu = menuState.layersMenuState;

  const toggleRotateCamera = menuState?.viewSettingsMenuState?.ROTATE_CHECKBOX;

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

  const layersKey = {
    TILE_MAP: TileMapLayer(),

    ABM: ABMLayer({
      data: cityIOdata,
      selected:
        layersMenu &&
        layersMenu.ABM_LAYER_CHECKBOX &&
        layersMenu.ABM_LAYER_CHECKBOX.selected,

      opacity:
        layersMenu &&
        layersMenu.ABM_LAYER_CHECKBOX &&
        layersMenu.ABM_LAYER_CHECKBOX.slider,
    }),

    AGGREGATED_TRIPS: AggregatedTripsLayer({
      data: cityIOdata,
      selected:
        layersMenu &&
        layersMenu.ABM_LAYER_CHECKBOX &&
        layersMenu.ABM_LAYER_CHECKBOX.selected,
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
      deckGLRef: deckGLRef,
    }),

    ACCESS: AccessLayer({
      setLayerHoveredData,
      data: cityIOdata,
      selected:
        layersMenu &&
        layersMenu.ACCESS_LAYER_CHECKBOX &&
        layersMenu.ACCESS_LAYER_CHECKBOX.selected,
      intensity:
        layersMenu &&
        layersMenu.ACCESS_LAYER_CHECKBOX &&
        layersMenu.ACCESS_LAYER_CHECKBOX.slider,
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

    TRAFFIC: TrafficLayer({
      setLayerHoveredData,
      data: cityIOdata,
      opacity:
        layersMenu &&
        layersMenu.TRAFFIC_LAYER_CHECKBOX &&
        layersMenu.TRAFFIC_LAYER_CHECKBOX.slider * 0.01,
    }),
  };

  const layerOrder = [
    "ABM",
    "AGGREGATED_TRIPS",
    "TILE_MAP",
    "GRID",
    "TEXTUAL",
    "GEOJSON",
    "ACCESS",
    "TRAFFIC",
  ];

  const renderDeckLayers = () => {
    let layers = [];
    layers.push(layersKey["TILE_MAP"]);
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
        {layerHoveredData && (
          <LayerHoveredTooltip
            layerHoveredData={layerHoveredData}
            mousePos={mousePos}
          />
        )}
        {/* only show if grid layer is on */}
        {layersMenu.GRID_LAYER_CHECKBOX &&
          layersMenu.GRID_LAYER_CHECKBOX.isOn && (
            <PaintBrush
              editOn={editModeToggle}
              mousePos={mousePos}
              selectedType={selectedType}
              pickingRadius={pickingRadius}
              mouseDown={mouseDown}
              hoveredObj={hoveredObj}
            />
          )}
        <DeckglBase
          setDeckGLRef={setDeckGLRef}
          layers={renderDeckLayers()}
          draggingWhileEditing={draggingWhileEditing}
          toggleRotateCamera={toggleRotateCamera}
        />
      </div>
    </>
  );
}
