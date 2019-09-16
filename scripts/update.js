import "./Storage";
import "babel-polyfill";
import "./Storage";

////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * controls the cityIO streeam
 */
export async function update() {
  let hashList = await getCityIO(Storage.cityIOurl + "/meta");
  Storage.oldAHashList = hashList;
  // get the grid from hashes
  let gridHash = hashList.hashes.grid;
  // if we obseve a new hash
  if (gridHash !== Storage.oldGridHash) {
    // get the new grid
    Storage.gridCityIOData = await getCityIO(Storage.cityIOurl + "/grid");
    // update the grid geojson
    updateGeoJsonGrid();
    // match the grid hash sotrage
    Storage.oldGridHash = gridHash;

    clearInterval(Storage.updateLayersInterval);
    Storage.updateLayersInterval = setInterval(updateLayers, 3000);
  }
}
//
//deal with simulation data update and storage

async function updateLayers() {
  // get the current access hash
  let oldAccessHash = Storage.oldAHashList.hashes.access;
  let result = await getCityIO(Storage.cityIOurl + "/meta");
  let newAccessHash = result.hashes.access;

  //  no new hash
  if (newAccessHash == oldAccessHash) {
    console.log("Same hash, still waiting for update on layer ...");
  }
  // if we got new hash
  else {
    console.log("New access hash", newAccessHash);
    Storage.oldAHashList.hashes.acesss = newAccessHash;
    // and update the layers source
    Storage.map
      // update the layers
      .getSource("accessSource")
      .setData("https://cityio.media.mit.edu/api/table/grasbrook/access");
    // stop the hash GET requests
    clearInterval(Storage.updateLayersInterval);
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
    .then(function(data) {
      return data;
    })
    .catch(err => {
      console.log("Error from '" + this.apiName + "':", err);
    });
}

export function updateGeoJsonGrid() {
  console.log("updating grid");
  let cityIOdata = Storage.gridCityIOData;
  let gridGeojsonActive = Storage.gridGeojsonActive;
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

  // go over all cells that are in active grid area
  for (let i = 0; i < gridGeojsonActive.features.length; i++) {
    // if the data for this cell is -1
    if (cityIOdata[i][0] == -1) {
      gridGeojsonActive.features[i].properties.height = 0;
      gridGeojsonActive.features[i].properties.color = "rgb(0,0,0)";
    } else {
      if (Storage.threeState == "flat" || Storage.threeState == null) {
        gridGeojsonActive.features[i].properties.height = 0.1;
      } else {
        gridGeojsonActive.features[i].properties.height =
          cellsFeaturesArray[cityIOdata[i][0]].height;
      }
      gridGeojsonActive.features[i].properties.color =
        cellsFeaturesArray[cityIOdata[i][0]].color;
    }
  }

  Storage.map.getSource("gridGeojsonActiveSource").setData(gridGeojsonActive);
}
