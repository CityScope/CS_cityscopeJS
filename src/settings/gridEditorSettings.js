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
