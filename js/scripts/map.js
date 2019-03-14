import "babel-polyfill";
import "./Storage";
import { create_threeJS_grid_form_cityIO } from "./three";

export function makeMap() {
  let cityIOdata = Storage.cityIOdata;
  // table physical loction
  let table_lat = cityIOdata.header.spatial.latitude;
  let table_lon = cityIOdata.header.spatial.longitude;
  // define the mapbox div element
  var mapbox_dom_div = document.createElement("div");
  mapbox_dom_div.className = "mapDIV";
  mapbox_dom_div.id = "mapDIV";
  document.body.appendChild(mapbox_dom_div);
  // should be better hideen ..
  mapboxgl.accessToken =
    "pk.eyJ1IjoicmVsbm94IiwiYSI6ImNpa2VhdzN2bzAwM2t0b2x5bmZ0czF6MzgifQ.KtqxBH_3rkMaHCn_Pm3Pag";
  // set the map origin
  var scence_origin_position = [table_lat, table_lon, 0];
  // make the map itself
  var map = new mapboxgl.Map({
    container: "mapDIV",
    style: "mapbox://styles/relnox/cjs9rb33k2pix1fo833uweyjd",
    center: [scence_origin_position[0], scence_origin_position[1]],
    bearing: 250,
    pitch: 35,
    zoom: 14
  });

  map.on("style.load", function() {
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
      render: function(gl, matrix) {
        threebox.update();
      }
    });

    //add the point simulation layer
    map.addLayer({
      id: "MultiPoint",
      source: "simData",
      type: "heatmap",
      paint: {
        "heatmap-radius": 10
      }
    });
  });

  function onAdd(map, mbxContext) {
    window.threebox = new Threebox(map, mbxContext);
    threebox.setupDefaultLights();
    // adds the 3d cityscope gemoerty
    threebox.addAtCoordinate(
      create_threeJS_grid_form_cityIO()[0],
      scence_origin_position,
      {
        preScale: 1
      }
    );
    // add the scene objects to storage for later update
    Storage.threeGrid = threebox.scene.children[0].children[1].children[0];
  }

  function reset_camera_position(angle) {
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    map.rotateTo(angle, { duration: 200 });

    if (angle !== 0)
      map.flyTo({
        center: find_middle_of_model(scence_origin_position, -600, 1300),
        bearing: angle,
        pitch: 0,
        zoom: 15
      });
  }

  function find_middle_of_model(
    scence_origin_position,
    offest_east,
    offest_north
  ) {
    //Earth’s radius, sphere
    let earth_radius = 6378137;

    //Coordinate offsets in radians
    let dLat = offest_north / earth_radius;
    let dLon =
      offest_east /
      (earth_radius * Math.cos((Math.PI * scence_origin_position[0]) / 180));

    //OffsetPosition, decimal degrees
    let latO = scence_origin_position[0] + (dLat * 180) / Math.PI;
    let lonO = scence_origin_position[1] + (dLon * 180) / Math.PI;

    return [latO, lonO];
  }

  //bring map to projection postion
  document
    .getElementById("listing-group")
    .addEventListener("change", function(e) {
      if (e.target.checked) {
        // Start the animation.
        reset_camera_position(0);
      } else {
        // Start the animation.
        //converted 35deg to radians in an ugly way

        reset_camera_position(-cityIOdata.header.spatial.rotation);
      }
    });

  Storage.map = map;
}
