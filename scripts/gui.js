import { rotateCamera, Camera } from "./camera";
import { updateGeoJsonGrid } from "./update";
import { updateAccessLayers } from "./update";

/*
Gui function 
*/
export function gui() {
  const cam = new Camera(Storage.map);
  //bring map to projection postion
  cam.reset_camera_position();
  // get UI div
  let uiDiv = document.getElementById("ui");
  // interval for demo layer
  let demoAccessLayerInterval = null;
  //

  document.addEventListener(
    "contextmenu",
    function(ev) {
      ev.preventDefault();
      keyEventOnMap();
      return false;
    },
    false
  );

  function keyEventOnMap(e) {
    if (uiDiv.style.display === "none") {
      uiDiv.style.display = "block";
      clearInterval(demoAccessLayerInterval);
      document.querySelector("#layerTitle").innerHTML = "";
    } else {
      uiDiv.style.display = "none";
      // add here test if layer is even on
      demoAccessLayerInterval = window.setInterval(demoLayer, 2000);
    }
    // }
  }

  function demoLayer() {
    // when hidden, go to demo mode for layers
    let AccessLayersNames = ["education", "food", "nightlife", "groceries"];
    let res =
      AccessLayersNames[Math.floor(Math.random() * AccessLayersNames.length)];
    updateAccessLayers(res);
    document.querySelector("#layerTitle").innerHTML = res;
  }

  document.getElementById("uiList").addEventListener("change", function(e) {
    switch (e.target.id) {
      case "projectionMode":
        if (e.target.checked) {
          if (Storage.reqAnimFrame !== null) {
            cancelAnimationFrame(Storage.reqAnimFrame);
          }
          Storage.map.setLayoutProperty("building", "visibility", "none");
          cam.reset_camera_position();
          Storage.threeState = "flat";
        } else {
          Storage.map.setLayoutProperty("building", "visibility", "visible");
          Storage.threeState = "height";
          // start camera rotation
          rotateCamera(1);
        }
        updateGeoJsonGrid();

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
          Storage.map.setLayoutProperty("AccessLayer", "visibility", "visible");
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
        updateAccessLayers(e.target.id);
      },
      false
    );
  }
}
