import "babel-polyfill";
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
  var mapbox_dom_div = document.createElement("div");
  mapbox_dom_div.className = "mapDIV";
  mapbox_dom_div.id = "mapDIV";
  document.body.appendChild(mapbox_dom_div);
  mapboxgl.accessToken =
    "pk.eyJ1IjoicmVsbm94IiwiYSI6ImNpa2VhdzN2bzAwM2t0b2x5bmZ0czF6MzgifQ.KtqxBH_3rkMaHCn_Pm3Pag";

  // set the map origin
  // make the map itself
  var map = new mapboxgl.Map({
    container: "mapDIV",
    style: "mapbox://styles/relnox/cjs9rb33k2pix1fo833uweyjd",
    center: [tableExtents[2][0], tableExtents[2][1]],
    zoom: 15
  });
  Storage.map = map;
  map.on("style.load", function() {
    layers();
    gui();
  });
}
