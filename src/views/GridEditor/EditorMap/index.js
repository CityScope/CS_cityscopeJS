import EditorBrush from "./EditorBrush";
import { useEffect, useState, useRef } from "react";
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import "mapbox-gl/dist/mapbox-gl.css";
import { GeoJsonLayer } from "deck.gl";
import { useSelector, useDispatch } from "react-redux";
import { hexToRgb, testHex } from "../../../utils/utils";
import { updateGridMaker } from "../../../redux/reducers/editorMenuSlice";
import { GridEditorSettings } from "../../../settings/settings";

export default function EditorMap() {
  const dispatch = useDispatch();
  const [grid, setGrid] = useState();
  // get the selected type from the store
  const selectedType = useSelector(
    (state) => state.editorMenuState.typesEditorState.selectedRow
  );

  // redux grid
  const createdGrid = useSelector((state) => state.editorMenuState.gridMaker);
  // create grid from redux store
  useEffect(() => {
    setGrid(createdGrid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdGrid]);

  // redux map center
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
  // const [hoveredObj, setHoveredObj] = useState();
  const [keyDownState, setKeyDownState] = useState();
  const [mousePos, setMousePos] = useState();
  const [mouseDown, setMouseDown] = useState();
  const [draggingWhileEditing, setDraggingWhileEditing] = useState(false);
  const [pickedCellsState] = useState();
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
   * @argument{object} event picking event
   */
  const multipleObjPicked = (event) => {
    const dim = pickingRadius;
    const x = event.x - dim / 2;
    const y = event.y - dim / 2;
    let multipleObj = deckGLref.current.pickObjects({
      x: x,
      y: y,
      width: dim,
      height: dim,
    });
    return multipleObj;
  };

  /**
   * Description. allow only to pick cells that are
   *  not of CityScope TUI & that are interactable
   * so to not overlap TUI activity
   */
  const handleGridCellEditing = (event) => {
    if (!selectedType) return;
    const { height, name, color, interactive } = selectedType;
    const multiSelectedObj = multipleObjPicked(event);

    multiSelectedObj.forEach((pickedObject, index) => {
      // create a copy of the object
      const thisCellProps = { ...pickedObject.object.properties };
      // modify the copy properties to match the selected type
      thisCellProps.color = testHex(color) ? hexToRgb(color) : color;
      thisCellProps.height = parseInt(height);
      thisCellProps.name = name;
      if (interactive !== "No") {
        thisCellProps.interactive = interactive;
      } else {
        delete thisCellProps.interactive;
      }
      //  assign the modified copy to the grid object
      setGrid((grid) => ({
        ...grid,
        features: grid.features.map((feature) => {
          if (pickedObject.index === feature.properties.id) {
            return {
              ...feature,
              properties: thisCellProps,
            };
          }
          return feature;
        }),
      }));
    });
  };

  /**
   * Description.
   * draw target area around mouse
   */
  const renderEditorBrush = () => {
    return (
      selectedType && (
        <EditorBrush
          mousePos={mousePos}
          selectedType={selectedType}
          divSize={pickingRadius}
          mouseDown={mouseDown}
          // hoveredObj={hoveredObj}
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
        visible: true,
        pickable: true,
        data: grid,
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
          getFillColor: pickedCellsState,
          getElevation: pickedCellsState,
        },
      }),
    ];
    return layers;
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onMouseMove={(e) => setMousePos(e.nativeEvent)}
      onMouseUp={() => {
        // ! when mouse is up, dispatch the grid to the store
        //! so it will be sent to the server when committing
        dispatch(updateGridMaker(grid));
        setMouseDown(false);
      }}
      onMouseDown={() => setMouseDown(true)}
    >
      {renderEditorBrush()}

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
