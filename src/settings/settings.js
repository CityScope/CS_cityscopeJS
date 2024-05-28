// import { cityIOModeBool } from "../utils/utils";
import queryString from "query-string";

const getServerLocation = () => {
  const location = window.location;
  const parsed = queryString.parse(location.search);

  const serverLocation =
    "cityio_local" in parsed
      ? "http://localhost:8080/api/"
      : "https://cityio.media.mit.edu/cityio/api/";
  console.log("cityIO server location: ", serverLocation);
  return serverLocation;
};

const getWebsocketServerLocation = () => {
  const location = window.location;
  const parsed = queryString.parse(location.search);

  const serverLocation =
    "cityio_local" in parsed
      ? "ws://localhost:8080/interface"
      : "wss://cityio.media.mit.edu/cityio/interface";
  console.log("cityIO websocket server location: ", serverLocation);
  return serverLocation;
};

// get the location of the app (local or remote)
const getCSJSLocation = () => {
  const location = window.location;
  const parsed = queryString.parse(location.search);
  const cityscopejs_local_url =
    "cityscopejs_local" in parsed
      ? "http://localhost:3000"
      : "https://cityscope.media.mit.edu/CS_cityscopeJS";
  console.log("cityScopeJS location: ", cityscopejs_local_url);
  return cityscopejs_local_url;
};

export const generalSettings = {
  csjsURL: getCSJSLocation(),
};

export const cityIOSettings = {
  docsURL:
    "https://raw.githubusercontent.com/CityScope/CS_cityscopeJS/master/docs/",
  cityIO: {
    baseURL: getServerLocation(),
    websocketURL: getWebsocketServerLocation(),

    ListOfTables: "table/list/",
    headers: "table/headers/",
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
      { name: "geo_heatmap", expectUpdate: true },
      { name: "traffic", expectUpdate: true },
    ],
  },
};
export const mapSettings = {
  map: {
    mapboxLink: "mapbox://styles/relnox/",
    mapboxRefreshString: "?fresh=true",
    mapStyles: {
      Dark: "ck0h5xn701bpr1dqs3he2lecq",
      Inverse: "cjlu6w5sc1dy12rmn4kl2zljn",
      Normal: "cl8dv36nv000t14qik9yg4ys6",
    },

    layers: {
      ABM: {
        endTime: 86400,
        startTime: 43200,
        animationSpeed: 100,
      },
    },
    initialViewState: {
      maxZoom: 22,
      pitch: 0,
      bearing: 0,
      longitude: -122.41669,
      latitude: 37.7853,
      zoom: 13,
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
    displayName: "Trips Volume",
    cityIOmoduleName: "ABM2",
    initState: false,
    initSliderValue: 5,
  },
  AGGREGATED_TRIPS_LAYER_CHECKBOX: {
    displayName: "Origin-Destination",
    cityIOmoduleName: "ABM2",
    initState: false,
    initSliderValue: 20,
  },
  ACCESS_LAYER_CHECKBOX: {
    displayName: "Heatmap",
    cityIOmoduleName: "access",
    initState: false,
    initSliderValue: 50,
    selected: 0,
  },
};

export const viewControlCheckboxes = {
  ROTATE_CHECKBOX: {
    displayName: "Rotate Camera",
    sliderTitle: "Camera Rotation Speed",
    initState: false,
    initSliderValue: 100,
  },

  ANIMATION_CHECKBOX: {
    displayName: "Toggle Animation",
    sliderTitle: "Animation Speed",
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
      normal: "mapbox://styles/relnox/cl8dv36nv000t14qik9yg4ys6?fresh=true",
    },
  },

  GEOGRIDDATA: {
    color: [0, 0, 0],
    height: [0, 50, 100],
    id: 0,
    interactive: "Web",
    name: "name",
  },

  GEOGRID: {
    features: [],
    properties: {
      header: {
        tableName: "test",
        cellSize: 15,
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
          description: "Offices and other commercial buildings, 0-100 stories",
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
          interactive: true,
          color: "#2482c6",
          height: [0, 50, 100],
        },
        Campus: {
          description: "Campus buildings, non-interactive, 0-30 stories",
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
          interactive: false,
          color: "#ab8f39",
          height: [0, 15, 30],
        },
        Park: {
          description:
            "Parks, playgrounds, and other open spaces. No height value",
          LBCS: [
            {
              proportion: 1,
              use: {
                "7240": 1,
              },
            },
          ],
          NAICS: null,
          interactive: true,
          color: "#7eb346",
          height: [0, 0, 0],
        },
        Residential: {
          description: "Residential buildings and apartments, 0-100 stories",
          LBCS: [
            {
              proportion: 1,
              use: {
                "1100": 1,
              },
            },
          ],
          NAICS: null,
          interactive: true,
          color: "#b97e18",
          height: [0, 50, 100],
        },
      },
    },
    type: "FeatureCollection",
  },
};
