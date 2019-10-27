import "./Storage";
// import * as turf from "@turf/turf";
import { getCityIO } from "./cityio";
import { Deck } from "@deck.gl/core";
import { MapboxLayer } from "@deck.gl/mapbox";
import { TripsLayer } from "@deck.gl/geo-layers";
import { Update, updateGeoJsonGrid } from "./update";

export class Layers {
  constructor() {
    this.map = Storage.map;
    this.updateableLayersList = [];
  }

  async layersLoader() {
    console.log("loading layers data..");
    let cityioHashes = await getCityIO(Storage.cityIOurl + "/meta");

    // load 3d building Layer
    this.buildingLayer();
    for (let hashName in cityioHashes.hashes) {
      switch (hashName) {
        case "grid_full_table":
          this.fullGridLayer();
          break;
        case "grid_interactive_area":
          this.activeGridLayer();
          this.updateableLayersList.push({
            hashName: hashName,
            hash: cityioHashes.hashes[hashName]
          });
          break;
        case "ABM":
          this.ABMlayer();
          break;
        case "access":
          this.accessLayer();
          this.updateableLayersList.push({
            hashName: hashName,
            hash: cityioHashes.hashes[hashName]
          });
          break;
        default:
          console.log(hashName, " not a layer.");
          break;
      }
    }
    new Update(this.updateableLayersList);
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
          0.1,
          0.5,
          0.8,
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
    const DATA_URL = {
      ABM: Storage.cityIOurl + "/ABM"
    };
    let abmData = await getCityIO(DATA_URL.ABM);
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

    let ABMlayerNames = {
      0: "Off",
      1: "Mobilty Mode",
      2: "User Type"
    };
    var ABMmodeSlider = document.getElementById("ABMslider");
    ABMmodeSlider.addEventListener("input", function() {
      Storage.ABMmodeType = ABMmodeSlider.value;
      document.getElementById("ABMmodeType").innerHTML =
        ABMlayerNames[Storage.ABMmodeType];
    });

    Storage.map.addLayer(
      new MapboxLayer({ id: ["ABMLayer"], deck: deckContext })
    );

    function renderDeck() {
      let ABMmodeType = Storage.ABMmodeType;

      if (time >= startSimHour + loopLength - 1) {
        time = startSimHour;
      } else {
        time = time + simPaceValue;
      }
      // toggle abm layer mode or type
      if (ABMmodeType == 0) {
        deckContext.setProps({
          layers: []
        });
        //
      } else if (ABMmodeType == 1) {
        deckContext.setProps({
          layers: [
            new TripsLayer({
              id: "modes",
              data: abmData,
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
      } else if (ABMmodeType == 2) {
        deckContext.setProps({
          layers: [
            new TripsLayer({
              id: "types",
              data: abmData,
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
