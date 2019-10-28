import "./Storage";
import "babel-polyfill";
import { getCityIO } from "./cityio";
var loEqual = require("lodash/isEqual");

export class Update {
  constructor(updateableLayersList) {
    this.hashListenInterval = 1000;
    this.updateableLayersList = updateableLayersList;
  }

  startUpdate() {
    // start looking for layer updates
    Storage.updateLayersInterval = setInterval(
      this.listenForHashUpdate.bind(this),
      this.hashListenInterval
    );
  }

  async listenForHashUpdate() {
    // loading spinner UI
    let spinnerDiv = document.querySelector("#spinner");
    // if the old hash holder and the new one are not the same
    if (loEqual(Storage.oldAHashList, this.updateableLayersList) == false) {
      // show spinner on loading
      if (spinnerDiv.style.display !== "inline-block")
        spinnerDiv.style.display = "inline-block";
      //
      for (let i in this.updateableLayersList) {
        let layerToUpdate = this.updateableLayersList[i].hashName;
        switch (layerToUpdate) {
          case "grid":
            this.updateInteractiveGrid();
            break;
          case "access":
            this.updateAccessLayer();
            break;
        }
      }
      // Storage.oldAHashList = this.updateableLayersList;
    } else if (alreadyUpdated == true) {
      //
      // listen to refreshed hashes
      // and populate 'updateableLayersList'
      let cityioHashes = await getCityIO(Storage.cityIOurl + "/meta");
      for (let i in this.updateableLayersList) {
        let thisHashName = this.updateableLayersList[i].hashName;
        this.updateableLayersList[i].hash = cityioHashes.hashes[thisHashName];
        if (thisHashName == "grid") {
        }
      }
      // hide spinner on done loading
      if (spinnerDiv.style.display !== "none") {
        spinnerDiv.style.display = "none";
      }
    }
  }

  async updateAccessLayer() {
    console.log("updating access layer");

    //  update the layers source
    Storage.map
      .getSource("accessSource")
      .setData(Storage.cityIOurl + "/access");
  }

  async updateInteractiveGrid() {
    console.log("updating grid");

    let gridData = await getCityIO(Storage.cityIOurl + "/grid");
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
    let gridGeojsonActive = Storage.gridGeojsonActive;
    // go over all cells that are in active grid area
    for (let i = 0; i < gridGeojsonActive.features.length; i++) {
      // if the data for this cell is -1
      if (gridData[i][0] == -1) {
        gridGeojsonActive.features[i].properties.height = 0;
        gridGeojsonActive.features[i].properties.color = "rgb(0,0,0)";
      } else {
        if (Storage.threeState == "flat" || Storage.threeState == null) {
          gridGeojsonActive.features[i].properties.height = 0.1;
        } else {
          gridGeojsonActive.features[
            i
          ].properties.height = this.cellsFeaturesArray[gridData[i][0]].height;
        }
        gridGeojsonActive.features[
          i
        ].properties.color = this.cellsFeaturesArray[gridData[i][0]].color;
      }
    }
    Storage.map.getSource("gridGeojsonActiveSource").setData(gridGeojsonActive);
  }
}
