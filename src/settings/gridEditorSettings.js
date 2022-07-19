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
      geogrid_to_tui_mapping: {},
      header: {
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
        Institutional: {
          LBCS: [
            {
              proportion: 0.3,
              use: {
                "6700": 1,
              },
            },
            {
              proportion: 0.7,
              use: {
                "2310": 0.3,
                "4100": 0.7,
              },
            },
          ],
          NAICS: [
            {
              proportion: 0.3,
              use: {
                "7121": 1,
              },
            },
            {
              proportion: 0.7,
              use: {
                "6111": 0.3,
                "6113": 0.1,
                "6115": 0.1,
                "6116": 0.2,
                "8133": 0.15,
                "8134": 0.15,
              },
            },
          ],
          interactive: "Web",
          color: "#B32745",
          height: 4,
          sqm_pperson: 400,
        },
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
        Road: {
          LBCS: [
            {
              proportion: 1,
              use: {
                "5210": 1,
              },
            },
          ],
          NAICS: null,
          interactive: "Web",
          color: "#308FB3",
          height: 1,
          sqm_pperson: 4,
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
        Retail: {
          LBCS: [
            {
              proportion: 1,
              use: {
                "2100": 0.6,
                "2200": 0.4,
              },
            },
          ],
          NAICS: [
            {
              proportion: 1,
              use: {
                "4451": 0.02,
                "4453": 0.02,
                "7224": 0.26,
                "7225": 0.7,
              },
            },
          ],
          interactive: "Web",
          color: "#FF835E",
          height: 4,
          sqm_pperson: 150,
        },
        Campus: {
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
                "3336": 0.5,
                "5414": 0.2,
                "5415": 0.1,
                "5417": 0.2,
              },
            },
          ],
          interactive: "Web",
          color: "#A2FF91",
          height: 10,
          sqm_pperson: 50,
        },
        Industrial: {
          LBCS: [
            {
              proportion: 1,
              use: {
                "3110": 1,
              },
            },
          ],
          NAICS: [
            {
              proportion: 1,
              use: {
                "4841": 0.2,
                "5617": 0.3,
                "5619": 0.3,
                "8111": 0.2,
              },
            },
          ],
          interactive: "Web",
          color: "#E83FB8",
          height: 4,
          sqm_pperson: 60,
        },
        "Low Income housing": {
          LBCS: [
            {
              proportion: 0.1,
              use: {
                "2200": 1,
              },
            },
            {
              proportion: 0.75,
              use: {
                "2310": 1,
              },
            },
            {
              proportion: 0.15,
              use: {
                "1200": 1,
              },
            },
          ],
          NAICS: [
            {
              proportion: 0.1,
              use: {
                "7224": 0.5,
                "7225": 0.5,
              },
            },
            {
              proportion: 0.75,
              use: {
                "5414": 0.4,
                "5415": 0.2,
                "5417": 0.4,
              },
            },
            {
              proportion: 0.15,
              use: {
                "7211": 1,
              },
            },
          ],
          interactive: "Web",
          color: "#E945FF",
          height: 20,
          sqm_pperson: 50,
        },
        "Residential Low Density": {
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
          color: "#7FB34B",
          height: 4,
          sqm_pperson: 320,
        },
      },
    },
    type: "FeatureCollection",
  },
};
