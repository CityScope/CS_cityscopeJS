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
