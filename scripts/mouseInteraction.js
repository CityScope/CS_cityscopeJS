import "./Storage";
import { Update } from "./update";
import mapboxgl from "mapbox-gl";

export class MouseInteraction {
  constructor() {
    this.InteractionModeDiv = document.getElementById("InteractionModeDiv");
    this.update = new Update();

    this.mapCanvas = Storage.map.getCanvasContainer();

    // Variable to hold the starting xy coordinates
    // when `mousedown` occured.
    this.start = null;

    // Variable to hold the current xy coordinates
    // when `mousemove` or `mouseup` occurs.
    this.current = null;

    // Variable for the draw box element.
    this.box = null;
    this.boudingBox = null;
  }

  mouseInteraction() {
    // listen to clicks on map
    Storage.map.on("click", "gridGeojsonActive", e => this.selectOnMap(e));
  }

  gridCellTypeEditing() {
    Storage.selectedGridCells = {};
    // slider for types
    var cellTypeSlider = document.getElementById("cellTypeSlider");

    cellTypeSlider.addEventListener("input", e => {
      if (Object.keys(Storage.selectedGridCells).length > 0) {
        for (let cell in Storage.girdLocalDataSource) {
          if (Storage.selectedGridCells[cell]) {
            Storage.girdLocalDataSource[cell][0] = cellTypeSlider.value;
          }
        }

        this.update.update_grid();
      }
    });
  }

  selectOnMap(e) {
    if (Storage.interactiveMode == true) {
      let grid = Storage.gridGeojsonActive;
      let selectedId = e.features[0].properties.id;
      let props = grid.features[selectedId].properties;
      if (props.color == "red") {
        props.color = props.oldColor;
        delete Storage.selectedGridCells[selectedId];
      } else {
        // store old color
        props.oldColor = props.color;
        props.color = "red";
        Storage.selectedGridCells[selectedId] = grid.features[selectedId];
      }
      this.InteractionModeDiv.innerHTML =
        Object.keys(Storage.selectedGridCells).length + " selected cells.";
      Storage.map.getSource("gridGeojsonActiveSource").setData(grid);
    }
  }

  boxSelection() {
    this.mapCanvas = Storage.map.getCanvasContainer();

    // Disable default box zooming.
    Storage.map.boxZoom.disable();
    // Set `true` to dispatch the event before other functions
    // call it. This is necessary for disabling the default map
    // dragging behaviour.

    this.mapCanvas.addEventListener("mousedown", e => this.mouseDown(e), true);

    Storage.map.on("mousemove", function(e) {
      var features = Storage.map.queryRenderedFeatures(e.point, {
        layers: ["gridGeojsonActive"]
      });
      // Change the cursor style as a UI indicator.
      Storage.map.getCanvas().style.cursor = features.length ? "pointer" : "";
      if (!features.length) {
        return;
      }
      var feature = features[0];
    });
  }

  // Return the xy coordinates of the mouse position
  mousePos(e) {
    var rect = this.mapCanvas.getBoundingClientRect();
    return new mapboxgl.Point(
      e.clientX - rect.left - this.mapCanvas.clientLeft,
      e.clientY - rect.top - this.mapCanvas.clientTop
    );
  }

  mouseDown(e) {
    // Continue the rest of the function if the shiftkey is pressed.
    if (!(e.shiftKey && e.button === 0)) return;

    // Disable default drag zooming when the shift key is held down.
    Storage.map.dragPan.disable();
    //
    document.addEventListener("mousemove", e => this.onMouseMove(e));
    document.addEventListener("mouseup", e => this.onMouseUp(e));
    document.addEventListener("keydown", e => this.onKeyDown(e));

    // Capture the first xy coordinates
    this.start = this.mousePos(e);
  }

  onMouseMove(e) {
    // Capture the ongoing xy coordinates
    this.current = this.mousePos(e);

    // Append the box element if it doesnt exist
    if (!this.box) {
      this.box = document.createElement("div");
      this.box.classList.add("boxdraw");
      this.mapCanvas.appendChild(this.box);
    }

    var minX = Math.min(this.start.x, this.current.x),
      maxX = Math.max(this.start.x, this.current.x),
      minY = Math.min(this.start.y, this.current.y),
      maxY = Math.max(this.start.y, this.current.y);

    // Adjust width and xy position of the box element ongoing
    var pos = "translate(" + minX + "px," + minY + "px)";
    this.box.style.transform = pos;
    this.box.style.WebkitTransform = pos;
    this.box.style.width = maxX - minX + "px";
    this.box.style.height = maxY - minY + "px";
  }

  finish() {
    // Remove these events now that finish has been called.
    document.removeEventListener("mousemove", e => this.onMouseMove(e));
    document.removeEventListener("keydown", e => this.onKeyDown(e));
    document.removeEventListener("mouseup", e => this.onMouseUp(e));

    if (this.box) {
      this.box.parentNode.removeChild(this.box);
      this.box = null;
    }

    // If bbox exists. use this value as the argument for `queryRenderedFeatures`
    if (this.boudingBox !== null) {
      console.log(this.boudingBox);

      var features = Storage.map.queryRenderedFeatures(this.boudingBox, {
        layers: ["gridGeojsonActive"]
      });
      if (features.length >= 200) {
        return window.alert("Select a smaller number of features");
      }
    }
    console.log(features);

    Storage.map.dragPan.enable();
  }

  onMouseUp(e) {
    console.log(e);

    // Capture xy coordinates
    this.boudingBox = [this.start, this.mousePos(e)];
    this.finish();
  }

  onKeyDown(e) {
    // If the ESC key is pressed
    if (e.keyCode === 27) this.finish();
  }
}
