export const expectedLayers = {
  GRID_LAYER_CHECKBOX: {
    displayName: "Grid Layer",
    cityIOmoduleName: "GEOGRID",
    initState: true,
    initSliderValue: 50,
  },
  ABM_LAYER_CHECKBOX: {
    displayName: "Simulation Layer",
    cityIOmoduleName: "ABM2",
    initState: false,
    initSliderValue: 100,
  },
  AGGREGATED_TRIPS_LAYER_CHECKBOX: {
    displayName: "Trips Layer",
    cityIOmoduleName: "ABM2",
    initState: false,
    initSliderValue: 100,
  },
  ACCESS_LAYER_CHECKBOX: {
    displayName: "Accessibility Layer",
    cityIOmoduleName: "access",
    initState: false,
    initSliderValue: 100,
  },
  TEXTUAL_LAYER_CHECKBOX: {
    displayName: "Text Layer",
    cityIOmoduleName: "GEOGRID",
    initState: false,
    initSliderValue: 100,
  },
  GEOJSON_LAYER_CHECKBOX: {
    displayName: "GeoJson Layer",
    cityIOmoduleName: "geojson",
    initState: false,
    initSliderValue: 50,
  },
};

export const viewControlCheckboxes = {
  ROTATE_CHECKBOX: {
    displayName: "Rotate Camera",
    initState: false,
    initSliderValue: 100,

  },
  SHADOWS_CHECKBOX: {
    displayName: "Toggle Shadows",
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
