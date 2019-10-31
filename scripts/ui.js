import { rotateCamera, Camera } from "./camera";
import { Update } from "./update";
import { cycleAccessLayers } from "./layers";
import "./Storage";

export class UI {
  init(updateableLayersList) {
    document.getElementById("AccesslayerSection").style.display = "none";
    document.getElementById("ABMlayerSection").style.display = "none";

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
    // interval for demo layer
    this.demoAccessLayerInterval = null;
    this.rightClickIteraction();
    this.uiButtonsInteraction();
  }

  uiButtonsInteraction() {
    let cam = new Camera();
    let update = new Update();
    Storage.selectedGridCells = {};
    //
    document.getElementById("uiList").addEventListener("change", e => {
      switch (e.target.id) {
        case "toggleInteraction":
          if (e.target.checked) {
            Storage.map.on("click", "gridGeojsonActive", e =>
              this.selectOnMap(e)
            );
          } else {
            Storage.map.on("click", "gridGeojsonActive", e =>
              e.preventDefault()
            );
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
          update.toggle_grid_height();
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
        // any other layer
        default:
          // if (e.target.checked) {
          //   Storage.map.setLayoutProperty(e.target.id, "visibility", "visible");
          // } else {
          //   Storage.map.setLayoutProperty(e.target.id, "visibility", "none");
          // }
          break;
      }
    });
  }

  selectOnMap(e) {
    let featureDiv = document.getElementById("InteractionModeDiv");
    Storage.map.getCanvas().style.cursor = "pointer";
    let grid = Storage.gridGeojsonActive;
    let selectedId = e.features[0].properties.id;

    console.log(e.features[0]);

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
    featureDiv.innerHTML =
      Object.keys(Storage.selectedGridCells).length + " selected cells.";
    console.log(Storage.selectedGridCells);

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
