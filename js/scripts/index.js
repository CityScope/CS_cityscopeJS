/////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
{{ CityScope CityScopeJS }}
Copyright (C) {{ 2018 }}  {{ Ariel Noyman }}

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

/////////////////////////////////////////////////////////////////////////////////////////////////////////

"@context": "https://github.com/CityScope/", "@type": "Person", "address": {
"@type": "75 Amherst St, Cambridge, MA 02139", "addressLocality":
"Cambridge", "addressRegion": "MA",}, 
"jobTitle": "Research Scientist", "name": "Ariel Noyman",
"alumniOf": "MIT", "url": "http://arielnoyman.com", 
"https://www.linkedin.com/", "http://twitter.com/relno",
https://github.com/RELNO]
*/
///////////////////////////////////////////////////////////////////////////////////////////////////////

// using https://github.com/peterqliu/threebox
import "babel-polyfill";
import "./Storage";
import { makeMap } from "./map";
import { getCityIO } from "./update";
import { layers } from "./layers/layers";
import { gui } from "./gui";
import { update } from "./update";
import { Maptastic } from "./lib/maptastic";

async function init() {
  // cityio update interval
  var update_interval = 200;
  //which cityIO endpoint to look for
  var cityio_table_name = window.location.search.substring(1);
  // otherwise, default to this table
  if (cityio_table_name == "") {
    cityio_table_name = "grasbrook";
  }
  let cityIOtableURL =
    "https://cityio.media.mit.edu/api/table/" + cityio_table_name.toString();
  // store it for later updates from cityio
  Storage.cityIOurl = cityIOtableURL;
  //call server once at start, just to init the grid
  const cityIOjson = await getCityIO(cityIOtableURL);
  //clear storage for old data holder
  Storage.cityIOdata_OLD = null;
  //save to storage
  Storage.cityIOdata = cityIOjson;
  // get the 4 points of the table extents on init
  Storage.tableExtents = Storage.cityIOdata.table_extents;

  //make the mapbox gl base map
  makeMap();
  // get map from storage
  let map = Storage.map;
  // wait for map to load
  map.on("style.load", function() {
    // do gui
    gui();
    // load layer
    layers();
    //run the layers update
    window.setInterval(update, update_interval);
  });

  let mapbox_div = document.querySelector("#keystoneDiv");
  let ui_div = document.querySelector("#ui");

  Maptastic(ui_div, mapbox_div);
}
//start applet
window.onload = init();
