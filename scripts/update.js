import mapboxgl from "mapbox-gl";
import "./Storage";
import "babel-polyfill";
import { getCityIO } from "./cityio";
var loEqual = require("lodash/isEqual");
import centroid from "@turf/centroid";

export class Update {
  constructor(updateableLayersList) {
    // loading spinner UI
    this.spinnerDiv = document.querySelector("#spinner");
    //
    this.loadingState = {};
    Storage.markerHolder = [];
    // init the hash list holder
    Storage.oldAHashList = {};
    this.loopInterval = 1000;
    this.updateableLayers = updateableLayersList;
    // ["street","housing","housing2","working","working_2"]
    this.cellsFeaturesDict = [
      {
        type: "st",
        color: "#373F51",
        height: 1
      },
      {
        type: "H1",
        color: "#002DD5",
        height: 20
      },
      {
        type: "H2",
        color: "#008DD5",
        height: 50
      },
      {
        type: "W1",
        color: "#E43F0F",
        height: 60
      },
      {
        type: "W2",
        color: "#F51476",
        height: 80
      },
      {
        type: "G",
        color: "#13D031",
        height: 3
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
    // this.demoModeHandler();

    // Edge case: if this is a new user window/table
    if (Object.keys(Storage.oldAHashList).length === 0) {
      // update all layers
      for (let layerToUpdate in this.updateableLayers) {
        // update the layer needed update
        let funcName = "update_" + layerToUpdate;
        this[funcName]();
        // update hashes of now updated layers
        Storage.oldAHashList[layerToUpdate] = this.updateableLayers[
          layerToUpdate
        ];
      }
      console.log("updating layer in new table...");
      return;
    }

    // deep compare old hash holder and the new cityIO one
    if (loEqual(Storage.oldAHashList, this.updateableLayers) == false) {
      this.loadingState.awaitingUpdate = true;
      // and check each layer indeviduly
      for (let layerToUpdate in this.updateableLayers) {
        // update the loading state
        if (
          this.updateableLayers[layerToUpdate] !==
          Storage.oldAHashList[layerToUpdate]
        ) {
          // which layer is now wating
          this.loadingState[layerToUpdate] = true;
          // update the layer needed update
          let funcName = "update_" + layerToUpdate;
          this[funcName]();
          // update hashes of now updated layers
          Storage.oldAHashList[layerToUpdate] = this.updateableLayers[
            layerToUpdate
          ];
        }
      }
    } else {
      this.loadingState = {};
      this.loadingState.awaitingUpdate = false;
      // listen to refreshed hashes
      // and populate 'updateableLayersList'
      let cityioHashes = await getCityIO(Storage.cityIOurl + "/meta");
      // populate updateableLayersList with new hashes from cityIO
      for (let layerToUpdate in this.updateableLayers) {
        this.updateableLayers[layerToUpdate] =
          cityioHashes.hashes[layerToUpdate];
      }
    }

    // visulize the loading
    this.loadingSpinner();
  }

  loadingSpinner() {
    // console.log("load state:", this.loadingState);
    if (this.loadingState.awaitingUpdate) {
      // show spinner on loading
      if (this.spinnerDiv.style.display !== "inline-block")
        this.spinnerDiv.style.display = "inline-block";
      return;
    }
    // hide spinner on done loading
    if (this.spinnerDiv.style.display !== "none") {
      this.spinnerDiv.style.display = "none";
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

  editCellTypes() {
    Storage.selectedGridCells = {};
    // slider for types
    let cellTypeSlider = document.getElementById("cellTypeSlider");
    let EditedTypeDiv = document.getElementById("EditedTypeDiv");
    cellTypeSlider.addEventListener("input", e => {
      if (Object.keys(Storage.selectedGridCells).length > 0) {
        for (let i in Storage.selectedGridCells) {
          let gridPosition =
            Storage.selectedGridCells[i].properties.interactive_id;
          // get the slider value as int and put it to grid array
          Storage.girdLocalDataSource[gridPosition][0] = parseInt(
            cellTypeSlider.value
          );
        }
        this.update_grid();
      }
      EditedTypeDiv.innerHTML = "Selected type: " + cellTypeSlider.value;
    });
  }

  cellTypeMarkers() {
    // clear old markers and holder
    if (Storage.markerHolder.length > 0) {
      for (var i = Storage.markerHolder.length - 1; i >= 0; i--) {
        Storage.markerHolder[i].remove();
      }
      Storage.markerHolder = [];
    }

    let interactiveGridMapping = Storage.interactiveGridMapping;
    for (let i in interactiveGridMapping) {
      let cellPos = interactiveGridMapping[i];
      let feature = Storage.gridGeoJSON.features[cellPos];
      var c = centroid(feature);
      let center = c.geometry.coordinates;

      const markerDiv = document.createElement("div");
      markerDiv.className = "typesMarkersStyle";
      markerDiv.innerHTML =
        feature.properties.type == -1
          ? "null"
          : this.cellsFeaturesDict[feature.properties.type].type;

      let marker = new mapboxgl.Marker(markerDiv)
        .setLngLat(center)
        .addTo(Storage.map);
      Storage.markerHolder.push(marker);
    }
  }

  async update_grid() {
    console.log("updating grid layer...");

    let gridData;
    if (Storage.interactiveMode == false) {
      gridData = await getCityIO(Storage.cityIOurl + "/grid");
      // store cityio grid data
      Storage.girdCityIODataSource = gridData;
    } else {
      // eventually assign data soruce to grid data
      gridData = Storage.girdLocalDataSource;
    }

    //
    let gridGeoJSON = Storage.gridGeoJSON;
    let interactiveGridMapping = Storage.interactiveGridMapping;
    // go over interactive cells that are in active grid area
    for (let i in interactiveGridMapping) {
      let interactiveCell = interactiveGridMapping[i];
      let props = gridGeoJSON.features[interactiveCell].properties;
      let interactiveMode = document.getElementById("InteractionModeSection")
        .style.display;

      // if the data for this cell is -1
      if (gridData[i][0] == -1) {
        props.color = "rgb(0,0,0)";
        // inject type from cityIO grid to GeoJSON layer
        props.type = -1;
        props.flat_value = 0;
        props.height = 0;
      } else {
        gridGeoJSON.features[
          interactiveCell
        ].properties.color = this.cellsFeaturesDict[gridData[i][0]].color;
        // inject type from cityIO grid to GeoJSON layer
        props.type = gridData[i][0];
        props.flat_value = 0;

        if (Storage.threeState == "flat" || Storage.threeState == null) {
          props.height = props.flat_value;
        } else {
          props.height = this.cellsFeaturesDict[gridData[i][0]].height;
          props.height_value = this.cellsFeaturesDict[gridData[i][0]].height;
        }
      }

      if (props.color == "red" && interactiveMode == "block") {
        props.color = "red";
      }
    }
    Storage.map.getSource("gridGeoJSONSource").setData(gridGeoJSON);

    // make markers and clean the past ones
    let markersButton = document.getElementById("markers");
    if (markersButton.checked == true || Storage.markerHolder.length < 1)
      this.cellTypeMarkers();

    // start counting time
    // Storage.demoCounter = new Date();
  }

  demoModeHandler() {
    let endTime = new Date();
    let timeDiff = endTime - Storage.demoCounter; //in ms
    timeDiff /= 1000;
    var seconds = Math.round(timeDiff);
    let i;
    if (seconds > 3) {
      let accessPropName = Object.keys(Storage.accessLayerProps)[i];

      console.log(Storage.accessLayerProps);
    }
  }
}
