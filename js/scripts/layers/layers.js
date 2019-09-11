import "../Storage";
import * as turf from "@turf/turf";
import { mobilityServiceLayer } from "./mobilityServiceLayer";
import * as gridGeojson from "../layers/grid.json";

export function layers() {
  let map = Storage.map;

  /* 
  grid layer 
  */

  map.addSource("gridLayerSource", {
    type: "geojson",
    data: gridGeojson.default
  });

  // one layer per GeoJSON feature type, see http://stackoverflow.com/a/36927026
  map.addLayer({
    id: "gridLayer",
    type: "fill-extrusion",
    source: "gridLayerSource",
    paint: {
      "fill-extrusion-color": ["get", "color"],
      "fill-extrusion-height": ["get", "height"],
      "fill-extrusion-opacity": 0.7,
      "fill-extrusion-base": 1
    }
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

  // /*
  // noise layer
  // */
  // map.addLayer({
  //   id: "noiseLayer",
  //   displayName: "Noise",
  //   showInLayerList: true,
  //   metadata: "",
  //   type: "raster",
  //   source: {
  //     type: "raster",
  //     tiles: [
  //       "https://geodienste.hamburg.de/HH_WMS_Strassenverkehr?format=image/png&service=WMS&version=1.3.0&STYLES=&bbox={bbox-epsg-3857}&request=GetMap&crs=EPSG:3857&transparent=true&width=512&height=512&layers=strassenverkehr_tag_abend_nacht_2017"
  //     ],
  //     tileSize: 512
  //   },
  //   paint: { "raster-opacity": 0.7 }
  // });

  // /*
  // 3d buildings
  // */

  // map.addLayer({
  //   id: "3dBuildingsLayer",
  //   displayName: "3dBuildingsLayer",
  //   source: "composite",
  //   "source-layer": "building",
  //   filter: ["==", "extrude", "true"],
  //   type: "fill-extrusion",
  //   minzoom: 10,
  //   paint: {
  //     "fill-extrusion-color": "#fff",
  //     "fill-extrusion-height": [
  //       "interpolate",
  //       ["linear"],
  //       ["zoom"],
  //       0.1,
  //       10,
  //       15.05,
  //       ["get", "height"]
  //     ],

  //     "fill-extrusion-opacity": 0.8
  //   },
  //   showInLayerList: true,
  //   addOnMapInitialisation: false
  // });

  // // /*
  // // Access

  // map.addSource("accessSource", {
  //   type: "geojson",
  //   data: "https://cityio.media.mit.edu/api/table/grasbrook/access"
  // });

  // map.addLayer({
  //   id: "AccessLayer",
  //   type: "circle",
  //   source: "accessSource",
  //   paint: {
  //     "circle-translate": [0, 0],
  //     "circle-radius": {
  //       property: "education",
  //       stops: [
  //         [{ zoom: 8, value: 0 }, 0.1],
  //         [{ zoom: 8, value: 1 }, 1],
  //         [{ zoom: 11, value: 0 }, 0.5],
  //         [{ zoom: 11, value: 1 }, 2],
  //         [{ zoom: 16, value: 0 }, 3],
  //         [{ zoom: 16, value: 1 }, 9]
  //       ]
  //     },
  //     "circle-color": {
  //       property: "education",
  //       stops: [[0, "red"], [0.5, "yellow"], [1, "green"]]
  //     }
  //   },
  //   hasReloadInterval: false,
  //   showInLayerList: true,
  //   addOnMapInitialisation: false
  // });

  // // check if this table has table extents features
  // if (Storage.tableExtents) {
  //   //table extents
  //   map.addLayer({
  //     id: "route",
  //     type: "line",
  //     source: {
  //       type: "geojson",
  //       data: {
  //         type: "Feature",
  //         properties: {},
  //         geometry: {
  //           type: "LineString",
  //           coordinates: Storage.tableExtents
  //         }
  //       }
  //     },
  //     layout: {
  //       "line-join": "round",
  //       "line-cap": "round"
  //     },
  //     paint: {
  //       "line-color": "rgba(255,255,255,1)",
  //       "line-width": 3,
  //       "line-dasharray": [3, 2, 1]
  //     }
  //   });

  //   /*
  //  turf hidden area aroud
  //  */
  //   var polygon = turf.polygon([Storage.tableExtents]);
  //   var masked = turf.mask(polygon);

  //   map.addLayer({
  //     id: "mask",
  //     type: "fill",
  //     source: {
  //       type: "geojson",
  //       data: masked
  //     },
  //     layout: {},
  //     paint: {
  //       "fill-color": "#000000",
  //       "fill-opacity": 0.9
  //     }
  //   });
  // }

  // /*
  //    threeJS layer
  // */
  // map.addLayer(threeLayer);
  // /*
  // deck layer
  // */
  // mobilityServiceLayer();
}
