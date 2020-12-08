import { GeoJsonLayer } from "deck.gl";
import { _handleGridcellEditing } from "../utils/BaseMapUtils";

export default function GridLayer({
    data,
    editOn,
    state: { selectedType, keyDownState, selectedCellsState, pickingRadius },
    updaters: { setSelectedCellsState, setDraggingWhileEditing, setHoveredObj },
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
        },

        onDragStart: () => {
            if (selectedType && editOn && keyDownState !== "Shift") {
                setDraggingWhileEditing(true);
            }
        },

        onHover: (e) => {
            if (e.object) {
                setHoveredObj(e);
            }
        },

        onDragEnd: () => {
            setDraggingWhileEditing(false);
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
