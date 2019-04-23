import "./Storage";
import "babel-polyfill";
import * as cityIOdemo from "./lib/cityio_demo.json";
import * as ABMdemo from "./lib/abm_demo.json";

////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * controls the cityIO streeam
 */
export async function update() {
  //temp solution to call this here
  //
  update_abm_simulation();

  // get cityIO url from storage and
  // put cityIO data to storage after it's updated
  Storage.cityIOdata = await getCityIO(Storage.cityIOurl);

  // check for new cityIO data stream
  if (
    Storage.cityIOdata_OLD !== null &&
    Storage.cityIOdata.meta.id.toString() ===
      Storage.cityIOdata_OLD.meta.id.toString()
  ) {
    return;
  } else {
    // compare the two data sets
    Storage.cityIOdata_OLD = Storage.cityIOdata;
    //update the grid props
    update_grid_from_cityio();
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * get cityIO method [uses polyfill]
 * @param cityIOtableURL cityIO API endpoint URL
 */
export async function getCityIO(url) {
  return fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(cityIOdata) {
      return cityIOdata;
    })
    .catch(err => {
      console.log("Error from '" + this.apiName + "':", err);
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Update the grid in fixed intervals
// should adapt a more passive updating approach

export function update_grid_from_cityio() {
  var array_of_types_and_colors = [
    {
      type: "Work 2",
      color: "#F51476",
      height: 100
    },
    {
      type: "work",
      color: "#E43F0F",
      height: 50
    },
    {
      type: "live2",
      color: "#008DD5",
      height: 50
    },

    {
      type: "Open Space",
      color: "#13D031",
      height: 0
    },
    {
      type: "Live1",
      color: "#002DD5",
      height: 20
    },

    {
      type: "Road",
      color: "#373F51",
      height: 0
    }
  ];

  let cityIOdata = Storage.cityIOdata;
  let grid = Storage.threeGrid;

  // let textHolder = Storage.threeText;

  for (let i = 0; i < grid.children.length; i++) {
    //cell edit
    let thisCell = grid.children[i];
    //clear the text obj
    // textHolder.children[i].text = " ";
    thisCell.position.z = 0;
    thisCell.scale.z = 1;

    if (cityIOdata.grid[i][0] !== -1) {
      thisCell.material.color.set(
        array_of_types_and_colors[cityIOdata.grid[i][0]].color
      );

      if (Storage.threeState == "height") {
        let this_cell_height =
          array_of_types_and_colors[cityIOdata.grid[i][0]].height + 1;
        thisCell.scale.z = this_cell_height;
        thisCell.position.z = this_cell_height / 2;
      } else if (Storage.threeState == "flat") {
        thisCell.position.z = 0;
        thisCell.scale.z = 1;
      }
    } else if (cityIOdata.grid[i][0] == -1) {
      // black outs the non-read pixels
      thisCell.position.z = 0;
      thisCell.material.color.set("#000");
    }
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function update_abm_simulation() {
  //deal with simulation data update and storage
  Storage.simData =
    "https://cityio.media.mit.edu/api/table/abm_service_Hamburg";
  Storage.map.getSource("simData").setData(Storage.simData);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// export async function update_sumo_simulation() {
//   //deal with simulation data update and storage
//   // Storage.simData = ABMdemo;
//   // await getCityIO(Storage.cityIOurl + "_sim");
//   // make json out of it
//   let sim_data_json = JSON.parse(Storage.simData.features);
//   function sumo_to_geojson(sim_data_json) {
//     let coordinates_list = [];
//     sim_data_json.forEach(function(t) {
//       coordinates_list.push(t[1]);
//     });
//     return {
//       type: "MultiPoint",
//       coordinates: coordinates_list
//     };
//   }
//   Storage.map.getSource("simData").setData(sumo_to_geojson(sim_data_json));
// }
