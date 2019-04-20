import "babel-polyfill";
import "./Storage";
import { layers } from "./layer";
import { cameraControl } from "./camera";

export function makeMap() {
  let cityIOdata = Storage.cityIOdata;
  // define the mapbox div element
  var mapbox_dom_div = document.createElement("div");
  mapbox_dom_div.className = "mapDIV";
  mapbox_dom_div.id = "mapDIV";
  document.body.appendChild(mapbox_dom_div);
  mapboxgl.accessToken =
    "pk.eyJ1IjoicmVsbm94IiwiYSI6ImNpa2VhdzN2bzAwM2t0b2x5bmZ0czF6MzgifQ.KtqxBH_3rkMaHCn_Pm3Pag";

  // table physical loction
  let table_lat = cityIOdata.header.spatial.latitude;
  let table_lon = cityIOdata.header.spatial.longitude;
  var scence_origin_position = [table_lat, table_lon, 0];

  // set the map origin
  // make the map itself
  var map = new mapboxgl.Map({
    container: "mapDIV",
    style: "mapbox://styles/relnox/cjs9rb33k2pix1fo833uweyjd",
    center: [scence_origin_position[0], scence_origin_position[1]],
    bearing: 250,
    pitch: 35,
    zoom: 14
  });
  Storage.map = map;
  map.on("style.load", function() {
    layers();
    cameraControl();
  });
}
