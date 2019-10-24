import "./Storage";
import "babel-polyfill";
import "./Storage";

////////////////////////////////////////////////////////////////////////////////////////////////////////

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

/**
 * controls the cityIO streeam
 */
export async function cityIOMetaListener() {
  let cityioHashes = await getCityIO(Storage.cityIOurl + "/meta");
  // get the grid from hashes
  let gridHash = cityioHashes.hashes.grid;

  // check if we obseve a new grid hash
  if (gridHash !== Storage.oldGridHash) {
    // get the new grid
    Storage.gridCityIOData = await getCityIO(Storage.cityIOurl + "/grid");

    // keep record of the grid hash
    Storage.oldGridHash = gridHash;

    // save all hashes to store
    Storage.oldAHashList = cityioHashes;

    //  clear loop before new one
    clearInterval(Storage.updateLayersInterval);
    // start looking for layer updates
    Storage.updateLayersInterval = setInterval(updateLayers, 1000);

    updateGeoJsonGrid();
  }
}

//
//deal with simulation data update and storage
async function updateLayers() {
  let spinnerDiv = document.querySelector("#spinner");
  if (spinnerDiv.style.display !== "inline-block") {
    spinnerDiv.style.display = "inline-block";
  }

  // get the current access hash
  let oldAccessHash = Storage.oldAHashList.hashes.access;
  // get hashes again in loop
  let result = await getCityIO(Storage.cityIOurl + "/meta");
  let currentAccessHash = result.hashes.access;
  //  check if it's the same hash
  if (currentAccessHash == oldAccessHash && Storage.firstLoadFlag !== true) {
    console.log("same hash, waiting for new..");
  }
  // if we got new hash
  else {
    Storage.firstLoadFlag = false;

    console.log("New access hash", currentAccessHash);
    Storage.oldAHashList.hashes.acesss = currentAccessHash;
    // and update the layers source
    Storage.map
      // update the layers
      .getSource("accessSource")
      .setData(
        "https://cityio.media.mit.edu/api/table/" +
          Storage.cityIOdata.header.name.toString() +
          "/access"
      );
    // stop the hash GET requests
    clearInterval(Storage.updateLayersInterval);
    // hide spinner
    spinnerDiv.style.display = "none";
  }
}

export function updateGeoJsonGrid() {
  console.log("updating grid");
  let cityIOdata = Storage.gridCityIOData;

  let gridGeojsonActive = Storage.gridGeojsonActive;

  // ! to be replaced with dynmaic data
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

  // check loaded

  if (gridGeojsonActive !== null) {
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
}

// access layer update function
export function updateAccessLayers(accessLayer) {
  accessLayer = accessLayer.toString();
  Storage.accessState = accessLayer;

  Storage.map.setPaintProperty("AccessLayerHeatmap", "heatmap-weight", [
    "interpolate",
    ["linear"],
    ["get", accessLayer],
    0,
    0.02,
    1,
    1
  ]);

  let accessHeatmapColorsArray = {
    food: [
      "interpolate",
      ["linear"],
      ["heatmap-density"],

      0,
      "rgba(255,0,0,0)",
      0.05,
      " rgba(112, 100, 179, 1)",
      0.4,
      "rgba(178, 219, 191, 1)",
      0.6,
      " rgba(243, 255, 189, 1)",
      0.8,
      " rgba(255, 150, 189, 1)",
      1,
      " rgba(255, 22, 84, 1)"
    ],
    groceries: [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(255,0,0,0)",
      0.05,
      "#EE3E32",
      0.3,
      "#fbb021",
      0.6,
      "#1b8a5a",
      0.8,
      "#1d4877"
    ],
    nightlife: [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(255,0,0,0)",
      0.05,
      "#5681b9",
      0.4,
      "#93c4d2",
      0.6,
      "#ffa59e",
      0.8,
      "#dd4c65",
      0.9,
      "#93003a"
    ],
    education: [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(255,0,0,0)",
      0.05,
      "red",
      0.4,
      "rgb(255, 124, 1)",
      0.6,
      "yellow",
      0.8,
      "rgb(142, 255, 0)",
      1,
      "green"
    ]
  };

  Storage.map.setPaintProperty(
    "AccessLayerHeatmap",
    "heatmap-color",
    accessHeatmapColorsArray[accessLayer]
  );
}

// map.addLayer({
//   id: "AccessLayer",
//   minzoom: 15,
//   type: "circle",
//   source: "accessSource",
//   paint: {
//     "circle-translate": [0, 0],
//     "circle-radius": {
//       property: "education",
//       stops: accessLayerStops
//     },
//     "circle-color": {
//       property: "education",
//       stops: [[0, "red"], [0.5, "yellow"], [1, "green"]]
//     }
//   }
// });

//
// Storage.map.setPaintProperty("AccessLayer", "circle-radius", {
//   property: accessLayer,
//   stops: accessLayerStops
// });
//

// let accessLayerStops = [
//   [{ zoom: 8, value: 0 }, 0.1],
//   [{ zoom: 8, value: 1 }, 1],
//   [{ zoom: 11, value: 0 }, 0.5],
//   [{ zoom: 11, value: 1 }, 2],
//   [{ zoom: 16, value: 0 }, 3],
//   [{ zoom: 16, value: 1 }, 10]
// ];
