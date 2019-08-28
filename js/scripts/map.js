import "babel-polyfill";
import { Maptastic } from "./lib/maptastic";
import "./Storage";

export function makeMap() {
  let cityIOdata = Storage.cityIOdata;
  // let table_lat = cityIOdata.header.spatial.latitude;
  // let table_lon = cityIOdata.header.spatial.longitude;

  // let cityIOdata = Storage.cityIOdata;
  let tableExtents = [
    [19.050979614257812, 47.43630292431787],
    [19.068617820739746, 47.435577210715834],
    [19.063854217529297, 47.40990954349756],
    [19.044928550720215, 47.41107124673388],
    [19.050979614257812, 47.43630292431787]
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
    center: [0, 0],
    zoom: 10
  });
  Storage.map = map;
}
