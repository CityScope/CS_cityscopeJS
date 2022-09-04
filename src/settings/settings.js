// import { cityIOModeBool } from "../utils/utils";
import queryString from "query-string";

const getServerLocation = () => {
  const location = window.location;
  const parsed = queryString.parse(location.search);

  const serverLocation =
    "cityio_local" in parsed
      ? "http://127.0.0.1:5000/api/"
      : "https://cityio.media.mit.edu/api/";
  console.log("cityIO server location: ", serverLocation);
  return serverLocation;
};
// get the location of the app (local or remote)
const getCSJSLocation = () => {
  const location = window.location;
  const parsed = queryString.parse(location.search);
  const csjsLocation =
    "csjs_local" in parsed
      ? "http://localhost:3000/CS_cityscopeJS/"
      : "https://cityscope.media.mit.edu/CS_cityscopeJS/";
  console.log("cityScopeJS location: ", csjsLocation);
  return csjsLocation;
};

export const generalSettings = {
  csjsURL: getCSJSLocation(),
};

export const cityIOSettings = {
  docsURL:
    "https://raw.githubusercontent.com/CityScope/CS_cityscopeJS/master/docs/",
  cityIO: {
    baseURL: getServerLocation(),

    ListOfTables: "tables/list/",
    interval: 500,
    cityIOmodules: [
      { name: "header", expectUpdate: false },
      { name: "GEOGRID", expectUpdate: false },
      { name: "ABM2", expectUpdate: true },
      { name: "geojson", expectUpdate: true },
      { name: "grid", expectUpdate: false },
      { name: "access", expectUpdate: true },
      { name: "GEOGRIDDATA", expectUpdate: false },
      { name: "indicators", expectUpdate: true },
      { name: "textual", expectUpdate: true },
      { name: "scenarios", expectUpdate: true },
      { name: "tui", expectUpdate: true },
    ],
  },
};
export const mapSettings = {
  map: {
    mapStyle: {
      sat: "mapbox://styles/relnox/cjs9rb33k2pix1fo833uweyjd?fresh=true",
      blue: "mapbox://styles/relnox/ck0h5xn701bpr1dqs3he2lecq?fresh=true",
    },
    layers: {
      ABM: {
        endTime: 86400,
        startTime: 43200,
        animationSpeed: 10,
      },
    },
    initialViewState: {
      maxZoom: 22,
      zoom: 15,
      pitch: 0,
      bearing: 0,
    },
  },
};

export const expectedLayers = {
  GRID_LAYER_CHECKBOX: {
    displayName: "CS Grid",
    cityIOmoduleName: "GEOGRID",
    initState: true,
    initSliderValue: 50,
  },
  ABM_LAYER_CHECKBOX: {
    displayName: "Animated Trips",
    cityIOmoduleName: "ABM2",
    initState: false,
    initSliderValue: 100,
  },
  AGGREGATED_TRIPS_LAYER_CHECKBOX: {
    displayName: "Aggregated Trips",
    cityIOmoduleName: "ABM2",
    initState: false,
    initSliderValue: 100,
  },
  ACCESS_LAYER_CHECKBOX: {
    displayName: "Heatmap",
    cityIOmoduleName: "access",
    initState: false,
    initSliderValue: 100,
  },
  TEXTUAL_LAYER_CHECKBOX: {
    displayName: "Text",
    cityIOmoduleName: "text",
    initState: false,
    initSliderValue: 100,
  },
  GEOJSON_LAYER_CHECKBOX: {
    displayName: "GeoJson",
    cityIOmoduleName: "geojson",
    initState: false,
    initSliderValue: 50,
  },
  MESH_LAYER_CHECKBOX: {
    displayName: "Mesh <beta>",
    cityIOmoduleName: "GEOGRID",
    initState: false,
    initSliderValue: 100,
  },
};

export const viewControlCheckboxes = {
  ROTATE_CHECKBOX: {
    displayName: "Rotate Camera",
    initState: false,
    initSliderValue: 100,
  },
  EFFECTS_CHECKBOX: {
    displayName: "Toggle Effects",
    initState: false,
    initSliderValue: 100,
  },
  ANIMATION_CHECKBOX: {
    displayName: "Toggle Animation",
    initState: false,
    initSliderValue: 100,
  },
};

export const viewControlButtons = {
  RESET_VIEW_BUTTON: {
    displayName: "Reset View",
    initState: false,
  },
  ORTHO_VIEW_BUTTON: {
    displayName: "Ortho View",
    initState: false,
  },
  NORTH_VIEW_BUTTON: {
    displayName: "North View",
    initState: false,
  },
};

export const GridEditorSettings = {
  map: {
    mapStyle: {
      sat: "mapbox://styles/relnox/cjs9rb33k2pix1fo833uweyjd?fresh=true",
      dark: "mapbox://styles/relnox/cjl58dpkq2jjp2rmzyrdvfsds?fresh=true",
      blue: "mapbox://styles/relnox/ck0h5xn701bpr1dqs3he2lecq?fresh=true",
    },
  },

  GEOGRIDDATA: {
    color: [0, 0, 0],
    height: 0,
    id: 0,
    interactive: "Web",
    name: "name",
  },

  GEOGRID: {
    features: [],
    properties: {
      header: {
        tableName: "test",
        cellSize: 50,
        latitude: 42.3664655,
        longitude: -71.0854323,
        tz: -5,
        ncols: 20,
        nrows: 20,
        rotation: 0,
        projection:
          "+proj=lcc +lat_1=42.68333333333333 +lat_2=41.71666666666667 +lat_0=41 +lon_0=-71.5 +x_0=200000 +y_0=750000 +ellps=GRS80 +datum=NAD83 +units=m +no_def",
      },

      types: {
        Office: {
          LBCS: [
            {
              proportion: 1,
              use: {
                "2310": 1,
              },
            },
          ],
          NAICS: [
            {
              proportion: 1,
              use: {
                "5400": 1,
              },
            },
          ],
          interactive: "Web",
          color: "#FF5277",
          height: 10,
          sqm_pperson: 20,
        },
        Park: {
          LBCS: [
            {
              proportion: 1,
              use: {
                "7240": 1,
              },
            },
          ],
          NAICS: null,
          interactive: "Web",
          color: "#38C9FF",
          sqm_pperson: 1,
        },
        Residential: {
          LBCS: [
            {
              proportion: 1,
              use: {
                "1100": 1,
              },
            },
          ],
          NAICS: null,
          interactive: "Web",
          color: "#FFFF33",
          height: 4,
          sqm_pperson: 90,
        },
      },
    },
    type: "FeatureCollection",
  },
};
