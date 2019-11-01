import "./Storage";
import "babel-polyfill";
import { getCityIO } from "./cityio";
var loEqual = require("lodash/isEqual");

export class Update {
  constructor(updateableLayersList) {
    // init the hash list holder
    Storage.oldAHashList = {};
    this.loopInterval = 1000;
    this.updateableLayersList = updateableLayersList;
    // loading spinner UI
    this.spinnerDiv = document.querySelector("#spinner");

    this.cellsFeaturesArray = [
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
        height: 60
      },

      {
        type: "Open Space",
        color: "#13D031",
        height: 3
      },
      {
        type: "Live1",
        color: "#002DD5",
        height: 25
      },

      {
        type: "Road",
        color: "#373F51",
        height: 1
      }
    ];
  }

  startUpdate() {
    // start looking for layer updates
    Storage.updateLayersInterval = setInterval(
      this.compareHashes.bind(this),
      this.loopInterval
    );
  }

  async compareHashes() {
    // deep compare old hash holder and the new cityIO one
    if (loEqual(Storage.oldAHashList, this.updateableLayersList) == false) {
      // show spinner on loading
      if (this.spinnerDiv.style.display !== "inline-block")
        this.spinnerDiv.style.display = "inline-block";
      // go through hashes
      for (let layerToUpdate in this.updateableLayersList) {
        // and check each layer indeviduly
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

  async update_ABM() {
    console.log("updating ABM layer...");
    Storage.ABMdata = await getCityIO(Storage.cityIOurl + "/ABM");
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
    let gridData;

    switch (Storage.boolGridDataSource) {
      case true:
      case undefined:
        gridData = await getCityIO(Storage.cityIOurl + "/grid");
        // store cityio grid data
        Storage.girdCityIODataSource = gridData;

        console.log("grid data source: cityIO");
        break;
      case false:
        // init local interaction with latest cityIO
        // grid data
        if (Storage.girdLocalDataSource == undefined) {
          console.log("first interaction, copying grid data");
          Storage.girdLocalDataSource = Storage.girdCityIODataSource;
        }
        gridData = Storage.girdLocalDataSource;
        console.log("grid data source: local");
        break;
    }

    let gridGeojsonActive = Storage.gridGeojsonActive;
    // go over all cells that are in active grid area
    for (let i = 0; i < gridGeojsonActive.features.length; i++) {
      let props = gridGeojsonActive.features[i].properties;
      let interactiveMode = document.getElementById("InteractionModeSection")
        .style.display;
      // if the data for this cell is -1
      if (gridData[i][0] == -1) {
        gridGeojsonActive.features[i].properties.color = "rgb(0,0,0)";
        // inject type from cityIO grid to GeoJSON layer
        props.type = -1;
        props.flat_value = 0;
        props.height = 0;
      } else {
        gridGeojsonActive.features[
          i
        ].properties.color = this.cellsFeaturesArray[gridData[i][0]].color;
        // inject type from cityIO grid to GeoJSON layer
        props.type = gridData[i][0];
        props.flat_value = 0;
        gridGeojsonActive.features[
          i
        ].properties.height = this.cellsFeaturesArray[gridData[i][0]].height;
        gridGeojsonActive.features[
          i
        ].properties.height_value = this.cellsFeaturesArray[
          gridData[i][0]
        ].height;
      }
      if (props.clicked && interactiveMode == "block") {
        props.color = "red";
      }
    }
    Storage.map.getSource("gridGeojsonActiveSource").setData(gridGeojsonActive);
  }

  toggle_grid_height() {
    let gridGeojsonActive = Storage.gridGeojsonActive;

    for (let i in gridGeojsonActive.features) {
      if (Storage.threeState == "flat" || Storage.threeState == null) {
        gridGeojsonActive.features[i].properties.height =
          gridGeojsonActive.features[i].properties.flat_value;
      } else {
        gridGeojsonActive.features[i].properties.height =
          gridGeojsonActive.features[i].properties.height_value;
      }
    }
    Storage.map.getSource("gridGeojsonActiveSource").setData(gridGeojsonActive);
  }
}
