import "./Storage";
import "babel-polyfill";

////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * controls the cityIO streeam
 */
export async function update() {
  //temp solution to call this here
  //
  update_simulation();

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
  // let cityIOtableURL = Storage.cityIOurl;

  // console.log("trying to fetch " + cityIOtableURL);
  return fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(cityIOdata) {
      // console.log("got cityIO table at " + cityIOdata.meta.timestamp);
      return cityIOdata;
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
export async function update_simulation() {
  /*
    https://github.com/samhermes/samhermes.github.io/blob/master/js/travel-map.js#L42
    */

  //deal with simulation data update and storage
  Storage.simData = await getCityIO(Storage.cityIOurl + "_sim");

  // make json out of it
  let sim_data_json = JSON.parse(Storage.simData.objects);

  function sumo_to_geojson(sim_data_json) {
    let coordinates_list = [];

    sim_data_json.forEach(function(t) {
      coordinates_list.push(t[1]);
    });

    return {
      type: "MultiPoint",
      coordinates: coordinates_list
    };
  }

  Storage.map.getSource("simData").setData(sumo_to_geojson(sim_data_json));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Update the grid in fixed intervals
// should adapt a more passive updating approach

export function update_grid_from_cityio() {
  var array_of_types_and_colors = [
    {
      type: "Road",
      color: "rgb(100,100,100)",
      height: 0
    },
    {
      type: "Open Space",
      color: "#13f797",
      height: 0
    },
    {
      type: "live",
      color: "#007fff",
      height: 30
    },
    {
      type: "work",
      color: "#cc28a2",
      height: 100
    },
    {
      type: "Work 2",
      color: "#ec0868",
      height: 50
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

    if (cityIOdata.grid[i] !== -1) {
      thisCell.material.color.set(
        array_of_types_and_colors[cityIOdata.grid[i]].color
      );
      let this_cell_height =
        array_of_types_and_colors[cityIOdata.grid[i]].height + 1;
      thisCell.scale.z = this_cell_height;
      thisCell.position.z = this_cell_height / 2;
    } else {
      // black outs the non-read pixels
      thisCell.position.z = 0;
      thisCell.material.color.set("rgb(0,0,0)");
    }
  }
}
