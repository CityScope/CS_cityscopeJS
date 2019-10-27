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

import "babel-polyfill";
import "./Storage";
import { createBaseMap } from "./map";
import { getCityIO } from "./cityio";
import { Layers } from "./layers";
import { Maptastic } from "./maptastic";

async function init() {
  //which cityIO endpoint to look for
  var cityio_table_name = window.location.search.substring(1);
  if (cityio_table_name !== "") {
    document.getElementById("landingPage").style.display = "none";
    let cityIOtableURL =
      "https://cityio.media.mit.edu/api/table/" + cityio_table_name.toString();
    // store it for later updates from cityio
    Storage.cityIOurl = cityIOtableURL;
    // get the header to locate the map
    Storage.cityioHeader = await getCityIO(cityIOtableURL + "/header");
    //make the mapbox base map
    createBaseMap();
    // get map from storage
    let map = Storage.map;
    // wait for map to load
    map.on("load", function() {
      const layers = new Layers();
      // load layer
      layers.layersLoader();
    });
  }

  // keystone the ui and map
  let mapbox_div = document.querySelector("#keystoneDiv");
  Maptastic(mapbox_div);
}
//start applet
window.onload = init();
