export const expectedLayers = {
  GRID_LAYER_CHECKBOX: {
    displayName: 'Grid Layer',
    cityIOmoduleName: 'GEOGRID',
    initState: true,
    hasSlider: true,
    initSliderValue: 100,
  },
  ABM_LAYER_CHECKBOX: {
    displayName: 'Simulation Layer',
    cityIOmoduleName: 'ABM2',
    initState: false,
    hasSlider: true,
    initSliderValue: 100,
  },
  AGGREGATED_TRIPS_LAYER_CHECKBOX: {
    displayName: 'Trips Layer',
    cityIOmoduleName: 'ABM2',
    initState: false,
    hasSlider: true,
    initSliderValue: 100,
  },
  ACCESS_LAYER_CHECKBOX: {
    displayName: 'Accessibility Layer',
    cityIOmoduleName: 'access',
    initState: false,
    hasSlider: true,
    initSliderValue: 100,
  },
  TEXTUAL_LAYER_CHECKBOX: {
    displayName: 'Text Layer',
    cityIOmoduleName: 'GEOGRID',
    initState: false,
  },
  GEOJSON_LAYER_CHECKBOX: {
    displayName: 'GeoJson Layer',
    cityIOmoduleName: 'geojson',
    initState: false,
  },
}

export const viewControlItems = {
  ANIMATE_CHECKBOX: {
    displayName: 'Animate',
    initState: false,
    hasSlider: true,
  },
  ROTATE_CHECKBOX: {
    displayName: 'Rotate Camera',
    initState: false,
  },
  SHADOWS_CHECKBOX: {
    displayName: 'Toggle Shadows',
    initState: false,
    hasSlider: true,
  },
}
