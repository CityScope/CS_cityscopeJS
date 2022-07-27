import EditorBrush from "./EditorBrush";
import { useEffect, useState, useRef } from "react";
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import "mapbox-gl/dist/mapbox-gl.css";
import { GeoJsonLayer } from "deck.gl";
import { useDispatch, useSelector } from "react-redux";
import settings from "../../../settings/settings.json";
import { hexToRgb } from "../../../utils/utils";
import { GridEditorSettings } from "../../../settings/gridEditorSettings";

export const dirLightSettings = {
  timestamp: Date.UTC(2019, 7, 1, 12),
  color: [255, 255, 255],
  intensity: 1.0,
  _shadow: true,
};

export default function EditorMap() {
  const selectedType = useSelector(
    (state) => state.editorMenuState.typesEditorState.selectedRow
  );

  const createdGrid = useSelector((state) => state.editorMenuState.gridMaker);
  const editorMapCenter = useSelector(
    (state) => state.editorMenuState.editorMapCenter
  );

  const deckGLref = useRef(null);
  const pickingRadius = 40;

  useEffect(() => {
    // zoom map on CS table location
    setViewStateToTableHeader(editorMapCenter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorMapCenter]);

  const [viewState, setViewState] = useState(
    GridEditorSettings.map.initialViewState
  );
  const [keyDownState, setKeyDownState] = useState();
  const [mousePos, setMousePos] = useState();
  const [mouseDown, setMouseDown] = useState();
  const [hoveredObj, setHoveredObj] = useState();
  const [draggingWhileEditing, setDraggingWhileEditing] = useState(false);
  const [selectedCellsState, setSelectedCellsState] = useState();

  const onViewStateChange = ({ viewState }) => {
    setViewState(viewState);
  };

  /**
   * resets the camera viewport
   * to cityIO header data
   * https://github.com/uber/deck.gl/blob/master/test/apps/viewport-transitions-flyTo/src/app.js
   */
  const setViewStateToTableHeader = (editorMapCenter) => {
    setViewState({
      ...viewState,
      latitude:
        (editorMapCenter && editorMapCenter.latCenter) ||
        GridEditorSettings.GEOGRID.properties.header.latitude,
      longitude:
        (editorMapCenter && editorMapCenter.lonCenter) ||
        GridEditorSettings.GEOGRID.properties.header.longitude,
      zoom: 15,
      pitch: 0,
      bearing: 0,
      orthographic: true,
    });
  };

  // fix deck view rotate
  useEffect(() => {
    document
      .getElementById("deckgl-wrapper")
      .addEventListener("contextmenu", (evt) => evt.preventDefault());
    // zoom map on CS table location
    setViewStateToTableHeader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Description. uses deck api to
   * collect objects in a region
   * @argument{object} e  picking event
   */
  const mulipleObjPicked = (e) => {
    const dim = pickingRadius;
    const x = e.x - dim / 2;
    const y = e.y - dim / 2;
    let mulipleObj = deckGLref.pickObjects({
      x: x,
      y: y,
      width: dim,
      height: dim,
    });
    return mulipleObj;
  };

  /**
   * Description. allow only to pick cells that are
   *  not of CityScope TUI & that are interactable
   * so to not overlap TUI activity
   */
  const handleGridCellEditing = (e) => {
    if (!selectedType) return;
    const { height, name, color, interactive } = selectedType;
    const multiSelectedObj = mulipleObjPicked(e);

    multiSelectedObj.forEach((selected) => {
      let thisCellProps = selected.object.properties;
      thisCellProps.color = hexToRgb(color);
      thisCellProps.height = parseInt(height);
      thisCellProps.name = name;
      if (interactive !== "No") {
        thisCellProps.interactive = interactive;
      } else {
        delete thisCellProps.interactive;
      }
    });
    setSelectedCellsState(multiSelectedObj);
  };

  /**
   * Description.
   * draw target area around mouse
   */
  const _renderSelectionTarget = () => {
    return (
      selectedType && (
        <EditorBrush
          mousePos={mousePos}
          selectedType={selectedType}
          divSize={pickingRadius}
          mouseDown={mouseDown}
        />
      )
    );
  };

  const handleKeyUp = () => {
    setKeyDownState(null);
  };

  const handleKeyDown = (e) => {
    // avoid common clicks
    setKeyDownState(e.nativeEvent.key);
  };

  /**
   * renders deck gl layers
   */
  const renderLayers = () => {
    const layers = [
      new GeoJsonLayer({
        id: "GRID",
        opacity: 0.5,
        stroked: false,
        filled: true,
        wireframe: true,
        data: createdGrid,
        visible: true,
        pickable: true,
        data: createdGrid,
        extruded: true,
        lineWidthScale: 1,
        lineWidthMinPixels: 1,
        getElevation: (d) => d.properties.height,
        getFillColor: (d) => d.properties.color,
        onClick: (event, cellInfo) => {
          if (!cellInfo.rightButton && keyDownState !== "Shift")
            handleGridCellEditing(event);
        },
        onDrag: (event, cellInfo) => {
          if (!cellInfo.rightButton && keyDownState !== "Shift")
            handleGridCellEditing(event);
        },
        onDragStart: (event, cellInfo) => {
          if (!cellInfo.rightButton && keyDownState !== "Shift") {
            setDraggingWhileEditing(true);
          }
        },
        onDragEnd: () => {
          setDraggingWhileEditing(false);
        },
        updateTriggers: {
          getFillColor: selectedCellsState,
          getElevation: selectedCellsState,
        },
        transitions: {
          getFillColor: 500,
          getElevation: 500,
        },
      }),
    ];
    return layers;
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onMouseMove={(e) =>
        setMousePos({
          mousePos: e.nativeEvent,
        })
      }
      onMouseUp={() =>
        setMouseDown({
          mouseDown: false,
        })
      }
      onMouseDown={() =>
        setMouseDown({
          mouseDown: true,
        })
      }
    >
      {_renderSelectionTarget()}

      <DeckGL
        ref={deckGLref}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        layers={renderLayers()}
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
          mapStyle={GridEditorSettings.map.mapStyle.sat}
          preventStyleDiffing={true}
        />
      </DeckGL>
    </div>
  );
}
