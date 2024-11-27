import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PaintBrush from "../../../Components/PaintBrush";
import { LayerHoveredTooltip } from "../../../Components/LayerHoveredTooltip";
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
  ArcBaseLayer,
  ColumnBaseLayer,
  ContourBaseLayer,
  GeoJsonBaseLayer,
  GridBaseLayer,
  GridCellBaseLayer,
  HeatmapBaseLayer,
  HexagonBaseLayer,
  IconBaseLayer,
  LineBaseLayer,
  PathBaseLayer,
  ScatterplotBaseLayer,
  ScenegraphBaseLayer,
  SimpleMeshBaseLayer,
  TextBaseLayer,
} from "./deckglLayers";
import { processGridData } from "./deckglLayers/GridLayer";
import useWebSocket from "react-use-websocket";
import { cityIOSettings } from "../../../settings/settings";

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

  const { sendJsonMessage } = useWebSocket(cityIOSettings.cityIO.websocketURL, {
    share: true,
    shouldReconnect: () => true,
  });

  // Send changes to cityIO
  useEffect(() => {
    if (!editModeToggle && GEOGRIDDATA) {
      let dataProps = [];
      for (let i = 0; i < GEOGRIDDATA.features.length; i++) {
        dataProps[i] = GEOGRIDDATA.features[i].properties;
      }
      sendJsonMessage({
        type: "UPDATE_GRID",
        content: {
          geogriddata: dataProps,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editModeToggle]);

  // update the grid layer with every change to GEOGRIDDATA
  useEffect(() => {
    setGEOGRIDDATA(processGridData(cityIOdata));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityIOdata.GEOGRIDDATA]);

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

  function getLayerByType(type, content) {
    if (type === "text") {
      return TextBaseLayer({
        data: content,
        opacity:
          layersMenu &&
          layersMenu[content.id] &&
          layersMenu[content.id].slider * 0.01,
      });
    } else if (type === "arc") {
      return ArcBaseLayer({
        data: content,
        opacity:
          layersMenu &&
          layersMenu[content.id] &&
          layersMenu[content.id].slider * 0.01,
      });
    } else if (type === "heatmap") {
      return HeatmapBaseLayer({
        data: content,
        opacity:
          layersMenu &&
          layersMenu[content.id] &&
          layersMenu[content.id].slider * 0.01,
      });
    } else if (type === "column") {
      return ColumnBaseLayer({
        data: content,
        opacity:
          layersMenu &&
          layersMenu[content.id] &&
          layersMenu[content.id].slider * 0.01,
      });
    } else if (type === "contour") {
      return ContourBaseLayer({
        data: content,
        opacity:
          layersMenu &&
          layersMenu[content.id] &&
          layersMenu[content.id].slider * 0.01,
      });
    } else if (type === "geojsonbase") {
      return GeoJsonBaseLayer({
        data: content,
        opacity:
          layersMenu &&
          layersMenu[content.id] &&
          layersMenu[content.id].slider * 0.01,
      });
    } else if (type === "grid") {
      return GridBaseLayer({
        data: content,
        opacity:
          layersMenu &&
          layersMenu[content.id] &&
          layersMenu[content.id].slider * 0.01,
      });
    } else if (type === "gridCell") {
      return GridCellBaseLayer({
        data: content,
        opacity:
          layersMenu &&
          layersMenu[content.id] &&
          layersMenu[content.id].slider * 0.01,
      });
    } else if (type === "hexagon") {
      return HexagonBaseLayer({
        data: content,
        opacity:
          layersMenu &&
          layersMenu[content.id] &&
          layersMenu[content.id].slider * 0.01,
      });
    } else if (type === "icon") {
      return IconBaseLayer({
        data: content,
        opacity:
          layersMenu &&
          layersMenu[content.id] &&
          layersMenu[content.id].slider * 0.01,
      });
    } else if (type === "line") {
      return LineBaseLayer({
        data: content,
        opacity:
          layersMenu &&
          layersMenu[content.id] &&
          layersMenu[content.id].slider * 0.01,
      });
    } else if (type === "path") {
      return PathBaseLayer({
        data: content,
        opacity:
          layersMenu &&
          layersMenu[content.id] &&
          layersMenu[content.id].slider * 0.01,
      });
    } else if (type === "scatterplot") {
      return ScatterplotBaseLayer({
        data: content,
        opacity:
          layersMenu &&
          layersMenu[content.id] &&
          layersMenu[content.id].slider * 0.01,
      });
    } else if (type === "scenegraph") {
      return ScenegraphBaseLayer({
        data: content,
        opacity:
          layersMenu &&
          layersMenu[content.id] &&
          layersMenu[content.id].slider * 0.01,
      });
    } else if (type === "simpleMesh") {
      return SimpleMeshBaseLayer({
        data: content,
        opacity:
          layersMenu &&
          layersMenu[content.id] &&
          layersMenu[content.id].slider * 0.01,
      });
    }
  }

  const layerOrder = [
    "TEXT",
    "ICON",
    "MESH",
    "SCENEGRAPH",
    "SCATTERPLOT",
    "PATH",
    "LINE",
    "GRID_CELL",
    "GRID_BASE",
    "GEOJSON_BASE",
    "CONTOUR",
    "COLUMN",
    "ARC",
    "ABM",
    "AGGREGATED_TRIPS",
    "TILE_MAP",
    "GRID",
    "TEXTUAL",
    "GEOJSON",
    "ACCESS",
    "TRAFFIC",
    "HEATMAP",
    "HEXAGON",
  ];

  const renderDeckLayers = () => {
    let layers = [];
    // ! [TEST] we stop loading the tile map layer as the base layer and instead use mapbox-gl
    // layers.push(layersKey["TILE_MAP"]);
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
    if (cityIOdata.layers)
      for (let i = 0; i < cityIOdata.layers.length; i++) {
        const moduleName = cityIOdata.layers[i].id;
        const moduleType = cityIOdata.layers[i].type;

        if (
          layersMenu &&
          layersMenu[moduleName] &&
          layersMenu[moduleName].isOn
        ) {
          layers.push(getLayerByType(moduleType, cityIOdata.layers[i]));
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
