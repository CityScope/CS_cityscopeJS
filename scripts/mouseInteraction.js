import "./Storage";
import { Update } from "./update";

export class MouseInteraction {
  constructor() {
    this.InteractionModeDiv = document.getElementById("InteractionModeDiv");
    this.update = new Update();

    this.mapCanvas = Storage.map.getCanvasContainer();

    // Variable to hold the starting xy coordinates
    // when `mousedown` occured.
    this.start;

    // Variable to hold the current xy coordinates
    // when `mousemove` or `mouseup` occurs.
    this.current;

    // Variable for the draw box element.
    this.box;
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
    // Disable default box zooming.
    Storage.map.boxZoom.disable();
    // Set `true` to dispatch the event before other functions
    // call it. This is necessary for disabling the default map
    // dragging behaviour.
    this.mapCanvas.addEventListener("mousedown", this.mouseDown, true);

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
    console.log(e);

    var rect = mapCanvas.getBoundingClientRect();
    return new mapboxgl.Point(
      e.clientX - rect.left - mapCanvas.clientLeft,
      e.clientY - rect.top - mapCanvas.clientTop
    );
  }

  mouseDown(e) {
    // Continue the rest of the function if the shiftkey is pressed.
    if (!(e.shiftKey && e.button === 0)) return;

    // Disable default drag zooming when the shift key is held down.
    Storage.map.dragPan.disable();

    // Call functions for the following events
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
    if (!box) {
      box = document.createElement("div");
      box.classList.add("boxdraw");
      mapCanvas.appendChild(box);
    }

    var minX = Math.min(start.x, current.x),
      maxX = Math.max(start.x, current.x),
      minY = Math.min(start.y, current.y),
      maxY = Math.max(start.y, current.y);

    // Adjust width and xy position of the box element ongoing
    var pos = "translate(" + minX + "px," + minY + "px)";
    box.style.transform = pos;
    box.style.WebkitTransform = pos;
    box.style.width = maxX - minX + "px";
    box.style.height = maxY - minY + "px";
  }

  finish(bbox) {
    // Remove these events now that finish has been called.
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("mouseup", this.onMouseUp);

    if (box) {
      box.parentNode.removeChild(box);
      box = null;
    }

    // If bbox exists. use this value as the argument for `queryRenderedFeatures`
    if (bbox) {
      var features = map.queryRenderedFeatures(bbox, {
        layers: ["counties"]
      });
      if (features.length >= 1000) {
        return window.alert("Select a smaller number of features");
      }
      // Run through the selected features and set a filter
      // to match features with unique FIPS codes to activate
      // the `counties-highlighted` layer.
      var filter = features.reduce(
        function(memo, feature) {
          memo.push(feature.properties.FIPS);
          return memo;
        },
        ["in", "FIPS"]
      );

      map.setFilter("counties-highlighted", filter);
    }
    map.dragPan.enable();
  }

  onMouseUp(e) {
    // Capture xy coordinates
    finish([start, this.mousePos(e)]);
  }

  onKeyDown(e) {
    // If the ESC key is pressed
    if (e.keyCode === 27) finish();
  }
}
