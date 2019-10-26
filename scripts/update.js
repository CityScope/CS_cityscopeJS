import "./Storage";
import "babel-polyfill";
import { getCityIO } from "./cityio";

export class Update {
  constructor(updateableLayersList) {
    this.updateableLayersList = updateableLayersList;
    this.listenForHashUpdate();
  }

  /*
  go through updateableLayersList 
  get each hash 
  for each hash
    if it's hash is new
      call this layer(hash name) to update 
      show spinner till all layers are done 
  repeat 
*/

  async listenForHashUpdate() {
    for (let i in this.updateableLayersList) {
      console.log(this.updateableLayersList[i]);
    }
  }

  /**
   * controls the cityIO stream
   */
  async cityIOMetaListener() {
    let cityioHashes = await getCityIO(Storage.cityIOurl + "/meta");
    // get the grid  hash
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
  async updateLayers() {
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
    if ((currentAccessHash == oldAccessHash) !== true) {
      console.log("same hash, waiting for new..");
    }
    // if we got new hash
    else {
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

  updateGeoJsonGrid() {
    this.cellsFeaturesArray = [
      {
        type: "Work 2",
        color: "#F51476",
        height: 50
      },
      {
        type: "work",
        color: "#E43F0F",
        height: 20
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
        height: 50
      },

      {
        type: "Road",
        color: "#373F51",
        height: 1
      }
    ];
    console.log("updating grid");
    let gridGeojsonActive = Storage.gridGeojsonActive;
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
          gridGeojsonActive.features[
            i
          ].properties.height = this.cellsFeaturesArray[
            cityIOdata[i][0]
          ].height;
        }
        gridGeojsonActive.features[
          i
        ].properties.color = this.cellsFeaturesArray[cityIOdata[i][0]].color;
      }
    }
    Storage.map.getSource("gridGeojsonActiveSource").setData(gridGeojsonActive);
  }

  // access layer update function
  updateAccessLayers(accessLayer) {
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
}
