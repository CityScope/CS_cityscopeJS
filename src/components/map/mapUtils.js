import settings from "../../settings/settings.json";

/**
 * Description. gets `props` with geojson
 * and procces the interactive area
 */
export const _proccessGridData = data => {
    const cityioData = data;
    let types = settings.map.types;
    const grid = cityioData.grid;
    const geojson = cityioData.meta_grid;
    const interactiveMapping = cityioData.interactive_grid_mapping;
    for (let i in interactiveMapping) {
        geojson.features[interactiveMapping[i]].properties.type = grid[i][0];
        geojson.features[interactiveMapping[i]].properties.color =
            types[grid[i][0]].color;
        geojson.features[interactiveMapping[i]].properties.height =
            types[grid[i][0]].height;
    }
    return geojson;
};

/**
 * Description. gets `props` with geojson
 * and procces the access layer data
 */
export const _proccessAccessData = data => {
    const accessData = data.access;
    // get colors from settings
    const colors = Object.values(settings.map.types).map(d => d.color);
    let coordinates = accessData.features.map(d => d.geometry.coordinates);
    let values = accessData.features.map(d => d.properties);
    let heatmap = [];
    for (let i = 0; i < coordinates.length; i++) {
        heatmap.push({
            coordinates: coordinates[i],
            values: values[i]
        });
    }
    return { colors: colors, heatmap: heatmap };
};
