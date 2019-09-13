import "./Storage";
import "babel-polyfill";
import * as gridGeojson from "./assets/geojson_grid.json";
import "./Storage";

////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * controls the cityIO streeam
 */
export async function update() {
  let hashList = await getCityIO(Storage.cityIOurl + "/meta");
  let hash = hashList.hashes.grid;
  if (hash !== Storage.oldHash) {
    // console.log("new grid", hash, Storage.oldHash);
    Storage.gridCityIOData = await getCityIO(Storage.cityIOurl + "/grid");
    updateGeoJsonGrid();
    Storage.oldHash = hash;
  } else {
    // console.log("no new grid", hash, Storage.oldHash);
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

export function updateGeoJsonGrid() {
  console.log("update grid");

  let cityIOdata = Storage.gridCityIOData;
  var cellsFeaturesArray = [
    {
      type: "Work 2",
      color: "#F51476",
      height: 50
    },
    {
      type: "work",
      color: "#E43F0F",
      height: 100
    },
    {
      type: "live2",
      color: "#008DD5",
      height: 30
    },

    {
      type: "Open Space",
      color: "#13D031",
      height: 3
    },
    {
      type: "Live1",
      color: "#002DD5",
      height: 20
    },

    {
      type: "Road",
      color: "#373F51",
      height: 1
    }
  ];

  let activeAreaArray = createActiveGridLocationsArray();

  // go over all cells that are in active grid area
  for (let i = 0; i < activeAreaArray.length; i++) {
    // if the data for this cell is -1
    if (cityIOdata[i][0] == -1) {
      gridGeojson.features[activeAreaArray[i]].properties.height = 0;
      gridGeojson.features[activeAreaArray[i]].properties.color = "rgb(0,0,0)";
    } else {
      if (Storage.threeState == "flat" || Storage.threeState == null) {
        gridGeojson.features[activeAreaArray[i]].properties.height = 0.1;
      } else {
        gridGeojson.features[activeAreaArray[i]].properties.height =
          cellsFeaturesArray[cityIOdata[i][0]].height;
      }

      gridGeojson.features[activeAreaArray[i]].properties.color =
        cellsFeaturesArray[cityIOdata[i][0]].color;
    }
  }

  Storage.map.getSource("gridLayerSource").setData(gridGeojson);
}

export async function updateLayer() {
  //deal with simulation data update and storage
  Storage.map
    .getSource("accessSource")
    .setData("https://cityio.media.mit.edu/api/table/grasbrook/access");
}

function createActiveGridLocationsArray() {
  let sx = 34;
  let sy = 13;
  let activeAreaArray = [];
  for (let celly = sy; celly < sy + 10; celly++) {
    for (let cellx = sx; cellx < sx + 10; cellx++) {
      // !!!!!
      activeAreaArray.push(cellx + celly * 78);
    }
  }
  return activeAreaArray;
}
