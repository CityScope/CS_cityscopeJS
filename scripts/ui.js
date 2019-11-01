import { rotateCamera, Camera } from "./camera";
import { Update } from "./update";
import { cycleAccessLayers } from "./layers";
import { postCityIO } from "./cityio";
import "./Storage";

export class UI {
  constructor() {
    document.getElementById("AccesslayerSection").style.display = "none";
    document.getElementById("ABMlayerSection").style.display = "none";
    document.getElementById("InteractionModeSection").style.display = "none";
    this.featureDiv = document.getElementById("InteractionModeDiv");

    this.update = new Update();
  }

  init(updateableLayersList) {
    for (let layer in updateableLayersList) {
      switch (layer) {
        case "access":
          this.accessButtonsInteraction();
          document.getElementById("AccesslayerSection").style.display = "block";
          break;
        case "ABM":
          this.accessButtonsInteraction();
          document.getElementById("ABMlayerSection").style.display = "block";
          break;
        default:
          break;
      }
    }
    //bring map to projection postion
    new Camera().reset_camera_position();
    this.rightClickIteraction();
    this.uiButtonsInteraction();
  }

  uiButtonsInteraction() {
    let cam = new Camera();
    // start listenining to gird editing
    this.gridCellTypeEditing();

    document.getElementById("uiList").addEventListener("change", e => {
      switch (e.target.id) {
        case "toggleInteraction":
          // data for gird is local
          if (e.target.checked) {
            document.getElementById("InteractionModeSection").style.display =
              "block";
            Storage.boolGridDataSource = false;
            Storage.selectedGridCells = {};
            Storage.map.on("click", "gridGeojsonActive", e =>
              this.selectOnMap(e)
            );
          } else {
            this.featureDiv.innerHTML = "";
            postCityIO(
              Storage.cityIOPostURL + "/grid",
              Storage.girdLocalDataSource
            );
            Storage.girdLocalDataSource;
            document.getElementById("InteractionModeSection").style.display =
              "none";
            // data for gird is cityIO
            Storage.boolGridDataSource = true;
            this.update.update_grid();
          }
          break;
        //
        case "projectionMode":
          if (e.target.checked) {
            Storage.threeState = "height";
            // start camera rotation
            rotateCamera(1);
          } else {
            if (Storage.cameraRotationAnimFrame !== null) {
              cancelAnimationFrame(Storage.cameraRotationAnimFrame);
            }

            cam.reset_camera_position();
          }
          break;
        //
        case "3dBuildingsLayer":
          if (e.target.checked) {
            Storage.map.setLayoutProperty(
              "3dBuildingsLayer",
              "visibility",
              "visible"
            );
            Storage.threeState = "height";
          } else {
            Storage.map.setLayoutProperty(
              "3dBuildingsLayer",
              "visibility",
              "none"
            );
            Storage.threeState = "flat";
          }
          this.update.toggle_grid_height();
          break;
        // keystone mode
        case "keystone":
          keystoneHandler();
          break;
        // access
        case "AccessLayer":
          if (e.target.checked) {
            Storage.map.setLayoutProperty(
              "AccessLayerHeatmap",
              "visibility",
              "visible"
            );
          } else {
            Storage.map.setLayoutProperty(
              "AccessLayerHeatmap",
              "visibility",
              "none"
            );
          }
          break;

        // full grid
        case "gridLayerLine":
          if (e.target.checked) {
            Storage.map.setLayoutProperty(
              "gridLayerLine",
              "visibility",
              "visible"
            );
          } else {
            Storage.map.setLayoutProperty(
              "gridLayerLine",
              "visibility",
              "none"
            );
          }
          break;
      }
    });
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
    let grid = Storage.gridGeojsonActive;
    let selectedId = e.features[0].properties.id;

    let props = grid.features[selectedId].properties;
    if (props.clicked) {
      props.clicked = false;
      props.color = props.oldColor;
      delete Storage.selectedGridCells[selectedId];
    } else {
      props.clicked = true;
      // store old color
      props.oldColor = props.color;
      props.color = "red";
      Storage.selectedGridCells[selectedId] = grid.features[selectedId];
    }
    this.featureDiv.innerHTML =
      Object.keys(Storage.selectedGridCells).length + " selected cells.";

    Storage.map.getSource("gridGeojsonActiveSource").setData(grid);
  }

  ABMinteraction() {
    // intercation with UI
    var ABMButtonsDiv = document.getElementsByClassName("ABMButtonsDiv");
    ABMButtonsDiv[0].addEventListener("click", function(e) {
      Storage.ABMmodeType = e.target.id;
    });
  }

  accessButtonsInteraction() {
    // select access layer
    let accessButtons = document.getElementsByClassName("accessButton");
    for (var i = 0; i < accessButtons.length; i++) {
      accessButtons[i].addEventListener(
        "click",
        function(e) {
          cycleAccessLayers(e.target.id);
        },
        false
      );
    }
  }

  rightClickIteraction() {
    // get UI div
    let uiDiv = document.querySelector("#ui");

    // right key interaction
    document.addEventListener(
      "contextmenu",
      function(rightClicked) {
        rightClicked.preventDefault();
        if (uiDiv.style.display === "none") {
          uiDiv.style.display = "block";
        } else {
          uiDiv.style.display = "none";
        }
        return false;
      },
      false
    );
  }
}

function keystoneHandler() {
  let localStorage = window.localStorage;
  // if there is a previous keystone
  if (localStorage["maptastic.layers"]) {
    let storageJSON = JSON.parse(localStorage.getItem("maptastic.layers"));
    //
    var w = screen.width;
    // 1920;
    var h = screen.height;
    //  1080;
    let windowDims = [[0, 0], [w, 0], [w, h], [0, h]];

    if (!storageJSON[0].mode || storageJSON[0].mode == "projection") {
      storageJSON[0].mode = "screen";
      storageJSON[0].sourcePoints_BU = storageJSON[0].sourcePoints;
      storageJSON[0].targetPoints_BU = storageJSON[0].targetPoints;
      //
      storageJSON[0].sourcePoints = windowDims;
      storageJSON[0].targetPoints = windowDims;
      localStorage.setItem("maptastic.layers", [JSON.stringify(storageJSON)]);
      location.reload();
    } else {
      storageJSON[0].mode = "projection";
      storageJSON[0].sourcePoints = storageJSON[0].sourcePoints_BU;
      storageJSON[0].targetPoints = storageJSON[0].targetPoints_BU;
      localStorage.setItem("maptastic.layers", [JSON.stringify(storageJSON)]);
      location.reload();
    }
  } else {
    let keystoneButtonDiv = document.getElementById("keystoneButton");
    keystoneButtonDiv.innerHTML =
      "No keystone found, click 'shift+z' to keystone";
    console.log("no older maptastic setup found");
  }
}
