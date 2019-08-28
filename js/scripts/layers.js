import "./Storage";
import * as turf from "@turf/turf";
import { create_threeJS_grid_form_cityIO } from "./three";
import { deck } from "./deck";

export function layers() {
  let map = Storage.map;
  let cityIOdata = Storage.cityIOdata;
  // table physical loction
  let table_lat = cityIOdata.header.spatial.latitude;
  let table_lon = cityIOdata.header.spatial.longitude;
  var scence_origin_position = [table_lon, table_lat, 0];
  console.log("scene origin", scence_origin_position);

  scence_origin_position = [19.050979614257812, 47.43630292431787, 5];

  // //add the custom THREE layer
  // map.addLayer({
  //   id: "custom_layer",
  //   type: "custom",
  //   onAdd: function(map, gl) {
  //     onAdd(map, gl);
  //   },
  //   render: function() {
  //     threebox.update();
  //   }
  // });

  // // Three
  // function onAdd(map, mbxContext) {
  //   window.threebox = new Threebox(map, mbxContext, { defaultLights: true });
  //   let csGrid = threebox
  //     .Object3D({ obj: create_threeJS_grid_form_cityIO(), units: "meters" })
  //     .setCoords(scence_origin_position);
  //   // adds the 3d cityscope gemoerty
  //   threebox.add(csGrid);
  //   // add the scene objects to storage for later update
  //   Storage.threeGrid = threebox.scene.children[0].children[1].children[0];
  // }

  let threeLayer = create_threeJS_grid_form_cityIO();
  map.addLayer(threeLayer);

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
  // //! turf hidden area aroud
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

  let deckLayer = deck();
  map.addLayer(deckLayer);
}
