import { GeoJsonLayer } from "deck.gl";
import { _handleGridcellEditing, translate, color_opc } from "../utils/BaseMapUtils";

export default function GridLayer({
    data,
    editOn,
    menu,
    state: { selectedType, keyDownState, selectedCellsState, pickingRadius, selectedFeaturesState, dragStart, resetDrag, roboscopeScale},
    updaters: { setSelectedCellsState, setDraggingWhileEditing, setHoveredObj, setDragStart, setResetDrag, setSelectedFeaturesState},
    deckGL,
    ws_ref
}) {
    return new GeoJsonLayer({
        id: "GRID",
        data,
        pickable: true,
        extruded: true,
        wireframe: true,
        lineWidthScale: 1,
        lineWidthMinPixels: 2,
        getElevation: (d) => d.properties.height,
        getFillColor: (d) => {
          if (selectedFeaturesState.length > 0) {
            return (selectedFeaturesState.includes(d.properties.id)) ? d.properties.color : color_opc(d.properties.color, 150);
          } else {
            return d.properties.color;
          } 
        },

        onClick: (event) => {
            if (selectedType && editOn && keyDownState !== "Shift")
                _handleGridcellEditing(
                    event,
                    selectedType,
                    setSelectedCellsState,
                    pickingRadius,
                    deckGL,
                    ws_ref,
                    selectedFeaturesState
                );
        },

        onDrag: (event) => {
            if (selectedType && editOn && keyDownState !== "Shift")
                _handleGridcellEditing(
                    event,
                    selectedType,
                    setSelectedCellsState,
                    pickingRadius,
                    deckGL,
                    ws_ref,
                    selectedFeaturesState
                );
            if (resetDrag==false){
              setResetDrag(true);
              setDragStart(deckGL.current.pickObjects({x: event.x, y: event.y})[0].index);
            }
        },

        onDragStart: (e) => {
            if (selectedType && editOn && keyDownState !== "Shift") {
                setDraggingWhileEditing(true);
            } else if (menu.includes("TRANSLATE") && keyDownState !== "Shift") {
                setDraggingWhileEditing(true);
                setResetDrag(false);
            } 
        },

        onHover: (e) => {
            if (e.object) {
                setHoveredObj(e);
            }
        },

        onDragEnd: (e) => {
            setDraggingWhileEditing(false);
            if (menu.includes("TRANSLATE") && !editOn && !menu.includes("SELECTION")) {
              if (selectedFeaturesState.includes(dragStart)) {
                let dragEnd = deckGL.current.pickObjects({x: e.x, y: e.y})[0].index;
                var temp = translate(data.properties.header, selectedFeaturesState, dragStart, dragEnd);
                setSelectedFeaturesState(temp);
                ws_ref.current._onGridDUpdate(roboscopeScale, temp.map(index => data.features[index].properties));
              }
            }
        },
        
        updateTriggers: {
            getFillColor: {selectedCellsState,selectedFeaturesState},
            getElevation: {selectedCellsState,selectedFeaturesState},
        },
        transitions: {
            getFillColor: 500,
            getElevation: 500,
        },
    });
}
