import "./Storage";
import "babel-polyfill";
import * as gridGeojson from "./layers/grid.json";

////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * controls the cityIO streeam
 */
export async function update() {
  Storage.gridCityIOData = await getCityIO(Storage.cityIOurl + "/grid");
  // updateLayer();
  updateGeoJsonGrid();
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
    .then(function(cityIOdata) {
      return cityIOdata;
    })
    .catch(err => {
      console.log("Error from '" + this.apiName + "':", err);
    });
}

function updateGeoJsonGrid() {
  let cityIOdata = Storage.gridCityIOData;
  var cellsFeaturesArray = [
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
      height: 100
    },

    {
      type: "Open Space",
      color: "#13D031",
      height: 1
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
  // gridGeojson.features.length

  for (let i = 0; i < 10; i++) {
    if (i < cityIOdata.length) {
      if (cityIOdata[i][0] == -1) {
        gridGeojson.features[i].properties.height = 10000;
        gridGeojson.features[i].properties.color = "rgba(0,0,0,0.1)";
      } else {
        gridGeojson.features[i].properties.height =
          cellsFeaturesArray[cityIOdata[i][0]].height;
        gridGeojson.features[i].properties.color =
          cellsFeaturesArray[cityIOdata[i][0]].color;
      }
    } else {
      gridGeojson.features[i].properties.height = 0;
      gridGeojson.features[i].properties.color = "rgb(0,0,0)";
      gridGeojson.features[i]["opacity"] = 0.1;
    }
  }

  Storage.map.getSource("gridLayerSource").setData(gridGeojson);
}

export async function updateLayer() {
  //deal with simulation data update and storage
  Storage.map
    .getSource("accessSource")
    .setData("https://cityio.media.mit.edu/api/table/grasbrook/access");
}
