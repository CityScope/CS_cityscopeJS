/*
! Binding addeventlistener:
! https://stackoverflow.com/questions/49091584/javascript-es6-addeventlistener-inside-class
! https://stackoverflow.com/questions/30446622/es6-class-access-to-this-with-addeventlistener-applied-on-method/30448329#30448329

! save the function that will be bound to the event, so you can remove it later
! ----
! this.scrollBoundFunction = this.scroll.bind(this);
! window.addEventListener("scroll", this.scrollBoundFunction);
! ----
! and later
! ----
! window.removeEventListener("scroll", this.scrollBoundFunction);
*/

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
    this.selectedFeatures = [];
  }

  singleCellSelection() {
    // listen to clicks on map
    Storage.map.on("click", "gridGeojsonActive", e =>
      this.handleSelectedCells([e])
    );
  }

  editCellTypes() {
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

  handleSelectedCells() {
    if (Storage.interactiveMode == true) {
      this.selectedFeatures.forEach(e => {
        let grid = Storage.gridGeojsonActive;
        let selectedId = e.properties.id;
        let props = grid.features[selectedId].properties;
        // if already slected
        if (props.color == "red") {
          // deselect
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
      });
    }
  }

  boxSelection() {
    // Disable default box zooming.
    Storage.map.boxZoom.disable();
    // Set `true` to dispatch the event before other functions
    // call it. This is necessary for disabling the default map
    // dragging behaviour.
    this.mapCanvas.addEventListener("mousedown", e => this.mouseDown(e), true);
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

    // ! bind listener to class obj for later removal
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
    document.addEventListener("keydown", this.onKeyDown);

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

  onMouseUp(e) {
    // Capture xy coordinates
    this.boudingBox = [this.start, this.mousePos(e)];
    this.finishBoxSelection();
  }

  onKeyDown(e) {
    // If the ESC key is pressed
    if (e.keyCode === 27) this.finishBoxSelection();
  }

  finishBoxSelection() {
    // Remove bounded events now that finish has been called.
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("mouseup", this.onMouseUp);

    if (this.box) {
      this.box.parentNode.removeChild(this.box);
      this.box = null;
    }

    // If bbox exists. use this value as the argument for `queryRenderedFeatures`
    if (this.boudingBox !== null) {
      var features = Storage.map.queryRenderedFeatures(this.boudingBox, {
        layers: ["gridGeojsonActive"]
      });
      if (features.length >= 250) {
        Storage.map.dragPan.enable();
        return window.alert("Select a smaller number of features");
      }
      Storage.map.dragPan.enable();
      this.selectedFeatures = features;
      this.handleSelectedCells();
    }
  }
}
