import "./Storage";
import * as turf from "@turf/turf";
import { create_threeJS_grid_form_cityIO } from "./three";
import { deck } from "./deck";

export function layers() {
  let map = Storage.map;

  /*
     threeJS layer
  */
  let threeLayer = create_threeJS_grid_form_cityIO();
  map.addLayer(threeLayer);

  /* 
  deck layer
  */
  let deckLayer = deck();
  map.addLayer(deckLayer);

  // check if this table has table extents features
  if (Storage.tableExtents) {
    console.log("table extents", Storage.tableExtents);
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

    /*
   turf hidden area aroud
   */
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
        "fill-opacity": 0.5
      }
    });
  }
}
