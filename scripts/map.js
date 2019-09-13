import "babel-polyfill";
import mapboxgl from "mapbox-gl";
import "./Storage";

export function makeMap() {
  // define the mapbox div element
  var keystoneDiv = document.createElement("div");
  keystoneDiv.className = "keystoneDiv";
  keystoneDiv.id = "keystoneDiv";
  document.body.appendChild(keystoneDiv);
  mapboxgl.accessToken =
    "pk.eyJ1IjoicmVsbm94IiwiYSI6ImNqd2VwOTNtYjExaHkzeXBzYm1xc3E3dzQifQ.X8r8nj4-baZXSsFgctQMsg";

  // set the map origin
  // make the map itself
  var map = new mapboxgl.Map({
    container: "keystoneDiv",
    // style: "mapbox://styles/relnox/ck0h5xn701bpr1dqs3he2lecq?fresh=true",
    style: "mapbox://styles/relnox/cjs9rb33k2pix1fo833uweyjd?fresh=true",
    center: [-71.08768, 42.3608],
    zoom: 18
  });
  Storage.map = map;
}
