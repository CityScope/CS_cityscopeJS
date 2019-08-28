import "./Storage";
import "babel-polyfill";

////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * controls the cityIO streeam
 */
export async function update() {
  Storage.gridCityIOData = await getCityIO(Storage.cityIOurl + "/grid");
  update_grid_from_cityio();
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
      height: 100
    },

    {
      type: "Open Space",
      color: "#13D031",
      height: 1
    },
    {
      type: "Live1",
      color: "#002DD5",
      height: 50
    },

    {
      type: "Road",
      color: "#373F51",
      height: 1
    }
  ];

  let cityIOdata = Storage.gridCityIOData;
  let grid = Storage.threeGrid;

  for (let i = 0; i < grid.children.length; i++) {
    //cell edit
    let thisCell = grid.children[i];

    thisCell.position.z = 0;
    thisCell.scale.z = 1;

    if (cityIOdata[i][0] !== -1) {
      thisCell.material.color.set(
        array_of_types_and_colors[cityIOdata[i][0]].color
      );

      if (Storage.threeState == "height") {
        let this_cell_height =
          array_of_types_and_colors[cityIOdata[i][0]].height;
        thisCell.scale.z = this_cell_height;
        thisCell.position.z = this_cell_height / 2;
      } else if (Storage.threeState == "flat") {
        thisCell.position.z = 0;
        thisCell.scale.z = 0.1;
      }
    } else if (cityIOdata[i][0] == -1) {
      // black outs the non-read pixels
      thisCell.position.z = 10;
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
