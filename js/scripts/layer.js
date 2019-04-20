import "./Storage";
import { create_threeJS_grid_form_cityIO } from "./three";
import { update } from "./update";

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

  //   add the point simulation layer
  map.addLayer({
    id: "MultiPoint",
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
          coordinates: [
            [10.00677491086256, 53.53789434597681],
            [10.000748807171703, 53.53278372885845],
            [10.016245501014993, 53.52640987365575],
            [10.02223991398489, 53.531586825893925],
            [10.00677491086256, 53.53789434597681]
          ]
        }
      }
    },
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": "rgb(255,0,255)",
      "line-width": 5,
      "line-dasharray": [0, 4, 3]
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

  //run the layers update
  window.setInterval(update, update_interval);
}
