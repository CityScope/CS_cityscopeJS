import "./Storage";
// import * as turf from "@turf/turf";
import { ABMlayer } from "./abmLayer";
import { getCityIO } from "./update";

export async function layers() {
  let map = Storage.map;

  // get two grid layers
  let gridGeojson = await getCityIO(Storage.cityIOurl + "/grid_full_table");
  let gridGeojsonActive = await getCityIO(
    Storage.cityIOurl + "/grid_interactive_area"
  );
  // save to global storage
  Storage.gridGeojson = gridGeojson;
  Storage.gridGeojsonActive = gridGeojsonActive;

  /* 
  grid layer 
  */
  map.addSource("gridLayerSource", {
    type: "geojson",
    data: gridGeojson
  });
  map.addLayer({
    id: "gridLayerLine",
    type: "line",
    source: "gridLayerSource",
    paint: {
      "line-color": "rgb(255,255,255)",
      "line-width": 0.5
    }
  });

  /*
  noise layer
  */
  map.addLayer({
    id: "noiseLayer",
    displayName: "Noise",

    showInLayerList: true,
    metadata: "",
    type: "raster",
    source: {
      type: "raster",
      tiles: [
        "https://geodienste.hamburg.de/HH_WMS_Strassenverkehr?format=image/png&service=WMS&version=1.3.0&STYLES=&bbox={bbox-epsg-3857}&request=GetMap&crs=EPSG:3857&transparent=true&width=512&height=512&layers=strassenverkehr_tag_abend_nacht_2017"
      ],
      tileSize: 512
    },
    paint: { "raster-opacity": 0.7 }
  });

  /*
  3d buildings
  */
  map.addLayer({
    id: "3dBuildingsLayer",
    displayName: "3dBuildingsLayer",
    source: "composite",
    "source-layer": "building",
    filter: ["==", "extrude", "true"],
    type: "fill-extrusion",
    minzoom: 10,
    paint: {
      "fill-extrusion-color": "#fff",
      "fill-extrusion-height": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0.1,
        10,
        15.05,
        ["get", "height"]
      ],
      "fill-extrusion-opacity": 0.8
    },
    showInLayerList: true,
    addOnMapInitialisation: false
  });

  /*
   Access
  */

  map.addSource("accessSource", {
    type: "geojson",
    data:
      "https://cityio.media.mit.edu/api/table/" +
      Storage.cityIOdata.header.name.toString() +
      "/access"
  });

  // Access
  map.addLayer({
    id: "AccessLayerHeatmap",
    type: "heatmap",
    source: "accessSource",
    // maxzoom: 15,
    paint: {
      "heatmap-weight": [
        "interpolate",
        ["linear"],
        ["get", "education"],
        0,
        0.1,
        0.5,
        0.8,
        1,
        1
      ],
      "heatmap-intensity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        10,
        0.1,
        15,
        1,
        16,
        3
      ],
      // Adjust the heatmap radius by zoom level
      "heatmap-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        10,
        1,
        15,
        100,
        16,
        300
      ],
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0,
        "rgba(255,0,0,0)",
        0.05,
        "red",
        0.4,
        "rgb(255, 124, 1)",
        0.6,
        "yellow",
        0.8,
        "rgb(142, 255, 0)",
        1,
        "green"
      ],

      "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 1, 1, 15, 0.7]
    }
  });

  /*
  deck layer
  */
  ABMlayer();

  // Active layer
  map.addSource("gridGeojsonActiveSource", {
    type: "geojson",
    data: gridGeojsonActive
  });
  map.addLayer({
    id: "gridGeojsonActive",
    type: "fill-extrusion",
    source: "gridGeojsonActiveSource",
    paint: {
      "fill-extrusion-color": ["get", "color"],
      "fill-extrusion-height": ["get", "height"],
      "fill-extrusion-opacity": 0.85,
      "fill-extrusion-base": 1
    }
  });

  Storage.firstLoadFlag = true;
}

// access layer update function
export function updateAccessLayers(accessLayer) {
  accessLayer = accessLayer.toString();
  Storage.accessState = accessLayer;

  Storage.map.setPaintProperty("AccessLayerHeatmap", "heatmap-weight", [
    "interpolate",
    ["linear"],
    ["get", accessLayer],
    0,
    0.02,
    1,
    1
  ]);

  let accessHeatmapColorsArray = {
    food: [
      "interpolate",
      ["linear"],
      ["heatmap-density"],

      0,
      "rgba(255,0,0,0)",
      0.05,
      " rgba(112, 100, 179, 1)",
      0.4,
      "rgba(178, 219, 191, 1)",
      0.6,
      " rgba(243, 255, 189, 1)",
      0.8,
      " rgba(255, 150, 189, 1)",
      1,
      " rgba(255, 22, 84, 1)"
    ],
    groceries: [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(255,0,0,0)",
      0.05,
      "#EE3E32",
      0.3,
      "#fbb021",
      0.6,
      "#1b8a5a",
      0.8,
      "#1d4877"
    ],
    nightlife: [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(255,0,0,0)",
      0.05,
      "#5681b9",
      0.4,
      "#93c4d2",
      0.6,
      "#ffa59e",
      0.8,
      "#dd4c65",
      0.9,
      "#93003a"
    ],
    education: [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(255,0,0,0)",
      0.05,
      "red",
      0.4,
      "rgb(255, 124, 1)",
      0.6,
      "yellow",
      0.8,
      "rgb(142, 255, 0)",
      1,
      "green"
    ]
  };

  Storage.map.setPaintProperty(
    "AccessLayerHeatmap",
    "heatmap-color",
    accessHeatmapColorsArray[accessLayer]
  );
}

// map.addLayer({
//   id: "AccessLayer",
//   minzoom: 15,
//   type: "circle",
//   source: "accessSource",
//   paint: {
//     "circle-translate": [0, 0],
//     "circle-radius": {
//       property: "education",
//       stops: accessLayerStops
//     },
//     "circle-color": {
//       property: "education",
//       stops: [[0, "red"], [0.5, "yellow"], [1, "green"]]
//     }
//   }
// });

//
// Storage.map.setPaintProperty("AccessLayer", "circle-radius", {
//   property: accessLayer,
//   stops: accessLayerStops
// });
//

// let accessLayerStops = [
//   [{ zoom: 8, value: 0 }, 0.1],
//   [{ zoom: 8, value: 1 }, 1],
//   [{ zoom: 11, value: 0 }, 0.5],
//   [{ zoom: 11, value: 1 }, 2],
//   [{ zoom: 16, value: 0 }, 3],
//   [{ zoom: 16, value: 1 }, 10]
// ];
