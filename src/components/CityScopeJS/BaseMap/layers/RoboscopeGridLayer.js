import { GeoJsonLayer } from "deck.gl";
import { _handleGridcellEditing } from "../utils/BaseMapUtils";

// Color Modifier: Opaque for selected pixels, transparent for unselected 
export const color_opc = (color, op) => {
  return [color[0], color[1], color[2], op]
}

// Translate Helper Functions: takes a list of indices and a start/end index to shift list of indices 
const twoDcoords = (header, index) => {
  return [parseInt(index%header.ncols), parseInt(index/header.ncols)]
}

const flat_index = (data, x,y) => {
  return y*data.ncols + x
}

export const translate = (data, features, start, end) => {
  var output = []
  const [x1,y1] = twoDcoords(data, start);
  const [x2,y2] = twoDcoords(data, end);
  const [x_f, y_f] = twoDcoords(data, features[0]);
  const [x_l, y_l] = twoDcoords(data, features[features.length-1]);
  const change_y= (y2-y1>0) ? Math.min(y2-y1, data.nrows-y_l-1) : Math.max(y2-y1, 0-y_f)
  const change_x= (x2-x1 > 0) ? Math.min(x2-x1, data.ncols-x_l-1) : Math.max(x2-x1, 0-x_f)  
  features.forEach((item) => {
    var [x, y] = twoDcoords(data, item);
    output.push(flat_index(data, x+change_x, y+change_y));
  });
  return output
}

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
              var temp = deckGL.current.pickObjects({x: event.x, y: event.y})[0]
              if (temp != null) {
                setResetDrag(true);
                setDragStart(temp.index);
              }
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
                let dragEnd = deckGL.current.pickObjects({x: e.x, y: e.y})[0];
                if (dragEnd != null) {
                  var temp = translate(data.properties.header, selectedFeaturesState, dragStart, dragEnd.index);
                  setSelectedFeaturesState(temp);
                  ws_ref.current._onGridDUpdate(roboscopeScale, temp.map(index => data.features[index].properties));
                }
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
