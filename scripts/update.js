import "./Storage";
import "babel-polyfill";
import { getCityIO } from "./cityio";
import layer from "@deck.gl/core/dist/es5/lib/layer";
var loEqual = require("lodash/isEqual");

export class Update {
  constructor(updateableLayersList) {
    // init the hash list holder
    Storage.oldAHashList = {};
    this.loopInterval = 1000;
    this.updateableLayersList = updateableLayersList;
    // loading spinner UI
    this.spinnerDiv = document.querySelector("#spinner");
  }

  startUpdate() {
    // start looking for layer updates
    Storage.updateLayersInterval = setInterval(
      this.compareHashes.bind(this),
      this.loopInterval
    );
  }

  async compareHashes() {
    // deep compare old hash holder and the new one are not the same
    if (loEqual(Storage.oldAHashList, this.updateableLayersList) == false) {
      for (let layerToUpdate in this.updateableLayersList) {
        // check each layer indeviduשly
        if (
          Storage.oldAHashList == null ||
          this.updateableLayersList[layerToUpdate] !==
            Storage.oldAHashList[layerToUpdate]
        ) {
          Storage.oldAHashList[layerToUpdate] = this.updateableLayersList[
            layerToUpdate
          ];
          let funcName = "update_" + layerToUpdate;
          this[funcName]();
        }
      }
      //
      // show spinner on loading
      if (this.spinnerDiv.style.display !== "inline-block")
        this.spinnerDiv.style.display = "inline-block";
      //
    } else if (
      loEqual(Storage.oldAHashList, this.updateableLayersList) == true
    ) {
      // listen to refreshed hashes
      // and populate 'updateableLayersList'
      let cityioHashes = await getCityIO(Storage.cityIOurl + "/meta");
      // populate updateableLayersList with new hashes from cityIO
      for (let layerToUpdate in this.updateableLayersList) {
        this.updateableLayersList[layerToUpdate] =
          cityioHashes.hashes[layerToUpdate];
      }
      //
      // hide spinner on done loading
      if (this.spinnerDiv.style.display !== "none") {
        this.spinnerDiv.style.display = "none";
      }
      //
    }
  }

  async update_access() {
    console.log("updating access layer...");

    //  update the layers source
    Storage.map
      .getSource("accessSource")
      .setData(Storage.cityIOurl + "/access");
  }

  async update_grid() {
    console.log("updating grid layer...");

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
