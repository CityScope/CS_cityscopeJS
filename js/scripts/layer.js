import "./Storage";

import * as turf from "@turf/turf";
import { create_threeJS_grid_form_cityIO } from "./three";
import { update } from "./update";
import { deck } from "./deck";

export function layers() {
  // cityio update interval
  var update_interval = 200;
  let map = Storage.map;
  let cityIOdata = Storage.cityIOdata;
  // table physical loction
  let table_lat = cityIOdata.header.spatial.latitude;
  let table_lon = cityIOdata.header.spatial.longitude;
  var scence_origin_position = [table_lat, table_lon, 0];
  // ! FOR NOW !!
  scence_origin_position = [10.013586800974366, 53.53297429860049, 0];

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

  // map.addLayer({ deck });

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
    window.threebox = new Threebox(map, mbxContext, { defaultLights: true });
    let csGrid = threebox
      .Object3D({ obj: create_threeJS_grid_form_cityIO(), units: "meters" })
      .setCoords(scence_origin_position);
    // adds the 3d cityscope gemoerty

    threebox.add(csGrid);
    // add the scene objects to storage for later update
    Storage.threeGrid = threebox.scene.children[0].children[1].children[0];
    console.log(Storage.threeGrid);
  }

  //
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

  map.setPaintProperty("noiseMap", "raster-opacity", 0.65);

  //! turf hidden area aroud
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

  //run the layers update
  window.setInterval(update, update_interval);
}
