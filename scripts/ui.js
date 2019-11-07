import { rotateCamera, Camera } from "./camera";
import { Update } from "./update";
import { cycleAccessLayers } from "./layers";
import { postCityIO } from "./cityio";
import { MouseInteraction } from "./mouseInteraction";
import "./Storage";

export class UI {
  constructor() {
    document.getElementById("InteractionModeSection").style.display = "none";
    this.InteractionModeDiv = document.getElementById("InteractionModeDiv");
    this.update = new Update();
    this.mouseInteraction = new MouseInteraction();
  }

  init() {
    for (let layer in Storage.updateableLayersList) {
      switch (layer) {
        case "access":
          this.accessButtonsInteraction();
          break;
        case "ABM":
          this.ABMinteraction();
          break;
        default:
          break;
      }
    }

    //bring map to projection postion
    new Camera().reset_camera_position();
    this.hideUI();
    this.uiButtonsInteraction();
    this.mouseInteraction.boxSelection();
  }

  uiButtonsInteraction() {
    let cam = new Camera();
    // start listenining to gird editing
    this.update.editCellTypes();
    document.getElementById("uiList").addEventListener("change", e => {
      switch (e.target.id) {
        // Interaction mode
        case "toggleInteraction":
          if (e.target.checked) {
            // data for gird is local
            Storage.interactiveMode = true;
            // empty the selected grid holder
            Storage.selectedGridCells = {};
            // init local interaction with latest cityIO
            // grid data
            console.log("copying grid data");
            Storage.girdLocalDataSource = Storage.girdCityIODataSource;
            // disply interaction controls
            document.getElementById("InteractionModeSection").style.display =
              "block";
          } else {
            // data for gird is cityIO
            Storage.interactiveMode = false;
            //
            this.InteractionModeDiv.innerHTML = "";
            // post edited grid to cityIO if not empty
            if (Storage.girdLocalDataSource) {
              postCityIO(
                Storage.cityIOPostURL + "/grid",
                Storage.girdLocalDataSource
              );
            }
            document.getElementById("InteractionModeSection").style.display =
              "none";

            this.update.update_grid();
            // reset the edits holder
            Storage.selectedGridCells = {};
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
        case "markers":
          if (e.target.checked) {
            // hide markers
            this.toggleMarkers("typesMarkersStyle", "block");
          } else {
            // show markers
            this.toggleMarkers("typesMarkersStyle", "none");
          }
          break;
        //
        case "3dBuildingsLayer":
          if (e.target.checked) {
            Storage.threeState = "height";
            Storage.map.setLayoutProperty(
              "3dBuildingsLayer",
              "visibility",
              "visible"
            );
          } else {
            Storage.map.setLayoutProperty(
              "3dBuildingsLayer",
              "visibility",
              "none"
            );
            Storage.threeState = "flat";
          }
          this.update.update_grid();
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

            document.getElementById(
              "AccesslayersButtonsSection"
            ).style.display = "inline-block";
          } else {
            Storage.map.setLayoutProperty(
              "AccessLayerHeatmap",
              "visibility",
              "none"
            );

            document.getElementById(
              "AccesslayersButtonsSection"
            ).style.display = "none";
          }
          break;

        // full grid
        case "gridLayer":
          if (e.target.checked) {
            Storage.map.setLayoutProperty(
              "gridGeoJSON",
              "visibility",
              "visible"
            );
          } else {
            Storage.map.setLayoutProperty("gridGeoJSON", "visibility", "none");
          }
          break;

        // ABM Layer
        case "ABMLayer":
          if (e.target.checked) {
            document.getElementById("ABMlayerSection").style.display = "block";
          } else {
            document.getElementById("ABMlayerSection").style.display = "none";
          }
          break;
      }
    });
  }

  toggleMarkers(className, displayState) {
    var elements = document.getElementsByClassName(className);
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.display = displayState;
    }
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
          cycleAccessLayers(e.currentTarget.id);
        },
        false
      );
    }
  }

  hideUI() {
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
