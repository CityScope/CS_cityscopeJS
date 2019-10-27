import { rotateCamera, Camera } from "./camera";
import { Update } from "./update";
import "./Storage";

export class UI {
  constructor() {
    this.map = Storage.map;
    this.update = new Update();
    // interval for demo layer
    this.demoAccessLayerInterval = null;
    //
  }

  init() {
    this.rightClickIteraction();
    this.cam = new Camera(Storage.map);
    //bring map to projection postion
    this.cam.reset_camera_position();
  }

  selectOnMap() {
    // ! TEMP INTERACTION
    this.map.on("click", "gridGeojsonActive", function(e) {
      Storage.map.getCanvas().style.cursor = "pointer";
      let gridGeojsonActive = Storage.gridGeojsonActive;
      let id = e.features[0].properties.id;
      let props = gridGeojsonActive.features[id].properties;
      if (props.clicked != true) {
        props.clicked = true;
        props.oldColor = props.color;
        props.color = "white";
      } else {
        props.clicked = false;
        props.color = props.oldColor;
      }
      Storage.map
        .getSource("gridGeojsonActiveSource")
        .setData(gridGeojsonActive);
    });
  }

  ABMinteraction() {
    // intercation with UI
    var ABMButtonsDiv = document.getElementsByClassName("ABMButtonsDiv");
    ABMButtonsDiv[0].addEventListener("click", function(e) {
      console.log(e.target.id);
      Storage.ABMmodeType = e.target.id;
    });
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

  uiButtonListInteraction() {
    document.getElementById("uiList").addEventListener("change", function(e) {
      switch (e.target.id) {
        case "projectionMode":
          if (e.target.checked) {
            if (Storage.cameraRotationAnimFrame !== null) {
              cancelAnimationFrame(Storage.cameraRotationAnimFrame);
            }
            Storage.map.setLayoutProperty(
              "3dBuildingsLayer",
              "visibility",
              "none"
            );
            cam.reset_camera_position();
            Storage.threeState = "flat";
          } else {
            Storage.map.setLayoutProperty(
              "3dBuildingsLayer",
              "visibility",
              "visible"
            );
            Storage.threeState = "height";
            // start camera rotation
            rotateCamera(1);
          }
          this.update.updateInteractiveGrid();
          break;

        // keystone mode
        case "keystone":
          let localStorage = window.localStorage;
          // if there is a previous keystone
          if (localStorage["maptastic.layers"]) {
            let storageJSON = JSON.parse(
              localStorage.getItem("maptastic.layers")
            );
            //
            var w = screen.width;
            // 1920;
            var h = screen.height;
            //  1080;
            let windowDims = [[0, 0], [w, 0], [w, h], [0, h]];
            //
            if (!storageJSON[0].mode || storageJSON[0].mode == "projection") {
              storageJSON[0].mode = "screen";
              storageJSON[0].sourcePoints_BU = storageJSON[0].sourcePoints;
              storageJSON[0].targetPoints_BU = storageJSON[0].targetPoints;
              //
              storageJSON[0].sourcePoints = windowDims;
              storageJSON[0].targetPoints = windowDims;
              localStorage.setItem("maptastic.layers", [
                JSON.stringify(storageJSON)
              ]);
              location.reload();
            } else {
              storageJSON[0].mode = "projection";
              storageJSON[0].sourcePoints = storageJSON[0].sourcePoints_BU;
              storageJSON[0].targetPoints = storageJSON[0].targetPoints_BU;
              localStorage.setItem("maptastic.layers", [
                JSON.stringify(storageJSON)
              ]);
              location.reload();
            }
          } else {
            let keystoneButtonDiv = document.getElementById("keystoneButton");
            keystoneButtonDiv.innerHTML =
              "No keystone found, click 'shift+z' to keystone";
            console.log("no older maptastic setup found");
          }
          break;
        //
        case "AccessLayer":
          if (e.target.checked) {
            Storage.map.setLayoutProperty(
              "AccessLayer",
              "visibility",
              "visible"
            );
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
            Storage.map.setLayoutProperty("AccessLayer", "visibility", "none");
          }
          break;

        // any other layer
        default:
          if (e.target.checked) {
            Storage.map.setLayoutProperty(e.target.id, "visibility", "visible");
          } else {
            Storage.map.setLayoutProperty(e.target.id, "visibility", "none");
          }
          break;
      }
    });

    //
    // select access layer
    let accessButtons = document.getElementsByClassName("accessButtons");
    for (var i = 0; i < accessButtons.length; i++) {
      accessButtons[i].addEventListener(
        "click",
        function(e) {
          console.log(e.target.id);
          update.cycleAccessLayers(e.target.id);
        },
        false
      );
    }
  }
}
