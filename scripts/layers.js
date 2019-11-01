import "./Storage";
// import * as turf from "@turf/turf";
import { getCityIO } from "./cityio";
import { Deck } from "@deck.gl/core";
import { MapboxLayer } from "@deck.gl/mapbox";
import { TripsLayer } from "@deck.gl/geo-layers";
import { Update } from "./update";
import { UI } from "./ui";

export class Layers {
  constructor() {
    this.map = Storage.map;
    this.updateableLayersList = {};
  }

  async layersLoader() {
    // start UI
    let ui = new UI();
    Object.freeze(ui);

    let r = new UI();

    console.log("loading layers data..");
    let cityioHashes = await getCityIO(Storage.cityIOurl + "/meta");

    // load 3d building Layer first
    this.buildingLayer();
    // then cycle between known layers
    for (let hashName in cityioHashes.hashes) {
      switch (hashName) {
        case "grid_full_table":
          this.fullGridLayer();
          break;
        case "grid_interactive_area":
          this.activeGridLayer();
          break;
        case "grid":
          this.updateableLayersList[hashName] = cityioHashes.hashes[hashName];

          break;
        case "ABM":
          this.ABMlayer();
          ui.ABMinteraction();
          this.updateableLayersList[hashName] = cityioHashes.hashes[hashName];

          break;
        case "access":
          this.accessLayer();
          this.updateableLayersList[hashName] = cityioHashes.hashes[hashName];

          break;
        default:
          break;
      }
    }

    let update = new Update(this.updateableLayersList);
    ui.init(this.updateableLayersList);
    update.startUpdate();
  }

  async fullGridLayer() {
    // get two grid layers
    let gridGeojson = await getCityIO(Storage.cityIOurl + "/grid_full_table");
    // grid layer
    this.map.addSource("gridLayerSource", {
      type: "geojson",
      data: gridGeojson
    });
    this.map.addLayer({
      id: "gridLayerLine",
      type: "line",
      source: "gridLayerSource",
      paint: {
        "line-color": "rgb(255,255,255)",
        "line-width": 0.2
      }
    });

    this.map.setLayoutProperty("gridLayerLine", "visibility", "none");
  }

  async activeGridLayer() {
    let gridGeojsonActive = await getCityIO(
      Storage.cityIOurl + "/grid_interactive_area"
    );
    // Active layer
    this.map.addSource("gridGeojsonActiveSource", {
      type: "geojson",
      data: gridGeojsonActive
    });
    Storage.gridGeojsonActive = gridGeojsonActive;

    this.map.addLayer({
      id: "gridGeojsonActive",
      type: "fill-extrusion",
      source: "gridGeojsonActiveSource",
      paint: {
        "fill-extrusion-color": ["get", "color"],
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-opacity": 0.8,
        "fill-extrusion-base": 1
      }
    });
  }

  noiseLayer() {
    /*
  noise layer
  */
    map.addLayer({
      id: "noiseLayer",
      displayName: "Noise",
      showInLayerList: true,
      metadata: "",
      type: "raster",
      source: {
        type: "raster",
        tiles: [
          "https://geodienste.hamburg.de/HH_WMS_Strassenverkehr?format=image/png&service=WMS&version=1.3.0&STYLES=&bbox={bbox-epsg-3857}&request=GetMap&crs=EPSG:3857&transparent=true&width=512&height=512&layers=strassenverkehr_tag_abend_nacht_2017"
        ],
        tileSize: 512
      },
      paint: { "raster-opacity": 0.7 }
    });

    this.map.setLayoutProperty("noiseLayer", "visibility", "none");
  }

  buildingLayer() {
    /*
  3d buildings
  */
    this.map.addLayer({
      id: "3dBuildingsLayer",
      displayName: "3dBuildingsLayer",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 10,
      paint: {
        "fill-extrusion-color": "#fff",
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0.1,
          10,
          15.05,
          ["get", "height"]
        ],
        "fill-extrusion-opacity": 0.7
      }
    });

    this.map.setLayoutProperty("3dBuildingsLayer", "visibility", "none");
  }

  accessLayer() {
    /*
   Access
  */
    this.map.addSource("accessSource", {
      type: "geojson",
      data: Storage.cityIOurl + "/access"
    });

    // Access
    this.map.addLayer({
      id: "AccessLayerHeatmap",
      type: "heatmap",
      source: "accessSource",
      // maxzoom: 15,
      paint: {
        "heatmap-weight": [
          "interpolate",
          ["linear"],
          ["get", "education"],
          0,
          0.02,
          1,
          1
        ],
        "heatmap-intensity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          10,
          0.1,
          15,
          1,
          16,
          3
        ],
        // Adjust the heatmap radius by zoom level
        "heatmap-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          10,
          1,
          15,
          100,
          16,
          300
        ],
        "heatmap-color": [
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
        ],

        "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 1, 1, 15, 0.7]
      }
    });

    this.map.setLayoutProperty("AccessLayerHeatmap", "visibility", "none");
  }

  async ABMlayer() {
    /*
  deck layer
    https://github.com/uber/deck.gl/blob/master/docs/api-reference/mapbox/mapbox-layer.md
    https://github.com/uber/deck.gl/blob/master/docs/api-reference/mapbox/overview.md?source=post_page---------------------------#using-with-pure-js
  */
    // get data at init
    Storage.ABMdata = await getCityIO(Storage.cityIOurl + "/ABM");

    let timeStampDiv = document.getElementById("timeStamp");
    let simPaceDiv = document.getElementById("simPaceDiv");
    let startSimHour = 60 * 60 * 7;
    let endSimHour = 60 * 60 * 12;
    let time = startSimHour;
    // a day in sec = 86400;
    let simPaceValue = 5;
    let loopLength = endSimHour - startSimHour;
    let refreshIntervalId;
    // ! GUI
    var mobilitySlider = document.getElementById("mobilitySlider");
    var simPaceSlider = document.getElementById("simPaceSlider");
    mobilitySlider.addEventListener("input", function() {
      time = startSimHour + (mobilitySlider.value / 100) * loopLength;
    });
    simPaceSlider.addEventListener("input", function() {
      simPaceValue = simPaceSlider.value / 100;
    });

    const deckContext = new Deck({
      gl: this.map.painter.context.gl,
      layers: []
    });

    Storage.map.addLayer(
      new MapboxLayer({
        id: ["ABMLayer"],
        deck: deckContext
      })
    );

    function renderDeck() {
      let ABMmodeType = Storage.ABMmodeType;

      if (time >= startSimHour + loopLength - 1) {
        time = startSimHour;
      } else {
        time = time + simPaceValue;
      }
      // toggle abm layer mode or type
      if (ABMmodeType == "Off") {
        deckContext.setProps({
          layers: []
        });
        //
      } else if (ABMmodeType == "Modes") {
        deckContext.setProps({
          layers: [
            new TripsLayer({
              id: "modes",
              data: Storage.ABMdata,
              getPath: d => d.path,
              getTimestamps: d => d.timestamps,
              getColor: d => {
                switch (d.mode[0]) {
                  case 0:
                    //purple
                    return [255, 0, 255];
                  case 1:
                    //blue
                    return [60, 128, 255];
                  case 2:
                    // green
                    return [153, 255, 51];
                  case 3:
                    // yellow
                    return [255, 255, 0];
                }
              },
              getWidth: 1,
              rounded: true,
              trailLength: 100,
              currentTime: time
            })
          ]
        });
      } else if (ABMmodeType == "OD") {
        deckContext.setProps({
          layers: [
            new TripsLayer({
              id: "types",
              data: Storage.ABMdata,
              getPath: d => d.path,
              getTimestamps: d => d.timestamps,
              getColor: d => {
                //switch between modes or types of users
                switch (d.mode[1]) {
                  case 0:
                    return [255, 0, 0];
                  case 1:
                    return [0, 0, 255];
                  case 2:
                    return [0, 255, 0];
                }
              },
              getWidth: 0.5,
              rounded: true,
              trailLength: 200,
              currentTime: time
            })
          ]
        });
      }

      // print the time on div
      var dateObject = new Date(null);
      dateObject.setSeconds(time); // specify value for SECONDS here
      var timeString = dateObject.toISOString().substr(11, 8);
      timeStampDiv.innerHTML = "time: " + timeString;
      simPaceDiv.innerHTML = "simulation pace x" + simPaceValue;
    }

    //! cancel by: clearInterval(refreshIntervalId);

    // start animation loop
    refreshIntervalId = setInterval(() => {
      renderDeck();
    });
  }
}

// access layer change
export function cycleAccessLayers(accessLayer) {
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
