import "babel-polyfill";
import { Maptastic } from "./lib/maptastic";

import "./Storage";
import { layers } from "./layer";
import { gui } from "./layer";

export function makeMap() {
  // let cityIOdata = Storage.cityIOdata;
  let tableExtents = [
    [10.00677491086256, 53.53789434597681],
    [10.02223991398489, 53.531586825893925],
    [10.016245501014993, 53.52640987365575],
    [10.000748807171703, 53.53278372885845],
    [10.00677491086256, 53.53789434597681]
  ];

  Storage.tableExtents = tableExtents;
  // define the mapbox div element
  var keystoneDiv = document.createElement("div");
  keystoneDiv.className = "keystoneDiv";
  keystoneDiv.id = "keystoneDiv";
  document.body.appendChild(keystoneDiv);
  mapboxgl.accessToken =
    "pk.eyJ1IjoicmVsbm94IiwiYSI6ImNqd2VwOTNtYjExaHkzeXBzYm1xc3E3dzQifQ.X8r8nj4-baZXSsFgctQMsg";

  let mapbox_div_element = document.querySelector("#keystoneDiv");
  // maptastic the div
  Maptastic(mapbox_div_element);
  // set the map origin
  // make the map itself
  var map = new mapboxgl.Map({
    container: "keystoneDiv",
    style: "mapbox://styles/relnox/cjs9rb33k2pix1fo833uweyjd",
    center: [tableExtents[2][0], tableExtents[2][1]],
    zoom: 10
  });
  Storage.map = map;
  map.on("style.load", function() {
    layers();
    gui();
  });
}
