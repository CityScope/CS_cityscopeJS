import "babel-polyfill";
import { Maptastic } from "./lib/maptastic";
import "./Storage";

export function makeMap() {
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
    center: [0, 0],
    zoom: 10
  });
  Storage.map = map;
}
