import { Camera, rotateCamera } from "./camera";
import { update_grid_from_cityio } from "./update";

/*
Gui function 
*/
export function gui() {
  const cam = new Camera(Storage.map);
  cam.getLatLon();
  //bring map to projection postion
  cam.reset_camera_position();
  // get UI div
  let uiDiv = document.getElementById("ui");
  uiDiv.style.display = "none";
  //
  document.addEventListener("keydown", keyEventOnMap, false);
  function keyEventOnMap(e) {
    if (e.keyCode == 32) {
      if (uiDiv.style.display === "none") {
        uiDiv.style.display = "block";
      } else {
        uiDiv.style.display = "none";
      }
    }
  }

  document
    .getElementById("listing-group")
    .addEventListener("change", function(e) {
      switch (e.target.id) {
        case "projectionMode":
          if (e.target.checked) {
            if (Storage.reqAnimFrame !== null) {
              cancelAnimationFrame(Storage.reqAnimFrame);
            }
            Storage.map.setLayoutProperty("mask", "visibility", "visible");
            Storage.map.setLayoutProperty("building", "visibility", "none");
            cam.reset_camera_position();
            Storage.threeState = "flat";
            update_grid_from_cityio();
          } else {
            Storage.map.setLayoutProperty("mask", "visibility", "none");
            Storage.map.setLayoutProperty("building", "visibility", "visible");
            Storage.threeState = "height";
            update_grid_from_cityio();
            rotateCamera(1);
          }
          break;
        // keystone mode
        case "keystone":
          let localStorage = window.localStorage;
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
          }
          console.log("no older maptastic setup found");
          break;
        default:
          if (e.target.checked) {
            Storage.map.setLayoutProperty(e.target.id, "visibility", "visible");
          } else {
            Storage.map.setLayoutProperty(e.target.id, "visibility", "none");
          }
          break;
      }
    });
}
