import "./Storage";
import "babel-polyfill";
import { getCityIO } from "./cityio";

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
    if (Storage.oldAHashList !== this.updateableLayersList) {
      // show spinner on loading
      if (spinnerDiv.style.display !== "inline-block")
        spinnerDiv.style.display = "inline-block";

      console.log("layers need updating...");
      for (let i in this.updateableLayersList) {
        let layerToUpdate = this.updateableLayersList[i].hashName;
        switch (layerToUpdate) {
          case "grid_interactive_area":
            this.updateInteractiveGrid();
            break;
          case "access":
            this.updateAccessLayer();
            break;
        }
      }
      Storage.oldAHashList = this.updateableLayersList;
    } else {
      console.log("layers are updated.");
      // get refreshed hashes
      let cityioHashes = await getCityIO(Storage.cityIOurl + "/meta");
      for (let i in this.updateableLayersList) {
        let thisHashName = this.updateableLayersList[i].hashName;
        this.updateableLayersList[i].hash = cityioHashes.hashes[thisHashName];
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

  // access layer change
  cycleAccessLayers(accessLayer) {
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
