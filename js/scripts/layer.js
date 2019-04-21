import "./Storage";
import * as turf from "@turf/turf";
import { create_threeJS_grid_form_cityIO } from "./three";
import { Camera, rotateCamera } from "./camera";
import { update, update_grid_from_cityio } from "./update";

export function layers() {
  // cityio update interval
  var update_interval = 200;
  let map = Storage.map;
  let cityIOdata = Storage.cityIOdata;
  // table physical loction
  let table_lat = cityIOdata.header.spatial.latitude;
  let table_lon = cityIOdata.header.spatial.longitude;
  var scence_origin_position = [table_lat, table_lon, 0];

  //add the dummy data of 1 point
  map.addSource("simData", {
    type: "geojson",
    data: {
      type: "MultiPoint",
      coordinates: [0, 0]
    }
  });

  //add the custom THREE layer
  map.addLayer({
    id: "custom_layer",
    type: "custom",
    onAdd: function(map, gl) {
      onAdd(map, gl);
    },
    render: function() {
      threebox.update();
    }
  });

  //table extents
  map.addLayer({
    id: "route",
    type: "line",
    source: {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: Storage.tableExtents
        }
      }
    },
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": "rgb(255,255,255)",
      "line-width": 3,
      "line-dasharray": [3, 2, 1]
    }
  });
  //
  // Three
  function onAdd(map, mbxContext) {
    window.threebox = new Threebox(map, mbxContext);
    threebox.setupDefaultLights();
    // adds the 3d cityscope gemoerty
    threebox.addAtCoordinate(
      create_threeJS_grid_form_cityIO(),
      scence_origin_position,
      {
        preScale: 1
      }
    );
    // add the scene objects to storage for later update
    Storage.threeGrid = threebox.scene.children[0].children[1].children[0];
  }
  map.addLayer({
    id: "noiseMap",
    displayName: "Noise",
    type: "raster",
    source: {
      type: "raster",
      tiles: [
        "https://geodienste.hamburg.de/HH_WMS_Strassenverkehr?format=image/png&service=WMS&version=1.3.0&STYLES=&bbox={bbox-epsg-3857}&request=GetMap&crs=EPSG:3857&transparent=true&width=512&height=512&layers=strassenverkehr_tag_abend_nacht_2017"
      ],
      tileSize: 512
    },
    paint: {}
  });

  map.setPaintProperty("noiseMap", "raster-opacity", 0.75);

  //  add the point simulation layer
  map.addLayer({
    id: "simData",
    source: "simData",
    type: "heatmap",
    paint: {
      "heatmap-weight": ["interpolate", ["linear"], ["get", "mag"], 0, 0, 6, 1],
      "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
      "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 1, 3, 15],
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0,
        "rgba(33,102,172,0)",
        0.2,
        "rgb(209,229,240)",
        0.4,
        "rgb(103,169,207)",
        0.6,
        "rgb(100,100,200)",
        0.8,
        "rgb(200,60,200)"
      ]
    }
  });

  console.log(Storage.tableExtents);

  var polygon = turf.polygon([Storage.tableExtents]);
  var masked = turf.mask(polygon);

  map.addLayer({
    id: "mask",
    type: "fill",
    source: {
      type: "geojson",
      data: masked
    },
    layout: {},
    paint: {
      "fill-color": "#000000",
      "fill-opacity": 1
    }
  });

  //run the layers update
  window.setInterval(update, update_interval);
}

/*
Gui function 
*/
export function gui() {
  const cam = new Camera(Storage.map);
  cam.getLatLon();
  cam.reset_camera_position(0);
  //bring map to projection postion
  document
    .getElementById("listing-group")
    .addEventListener("change", function(e) {
      switch (e.target.id) {
        case "noiseMap":
          if (e.target.checked) {
            Storage.map.setLayoutProperty("noiseMap", "visibility", "visible");
          } else {
            Storage.map.setLayoutProperty("noiseMap", "visibility", "none");
          }
          break;
        case "rotateTo":
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
        default:
          break;
      }
    });
}
