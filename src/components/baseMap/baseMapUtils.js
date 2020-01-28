import settings from "../../settings/settings.json";
import axios from "axios";
var tzlookup = require("tz-lookup");

/**
 * returns time for table location
 * for the light emlement
 * @param {*} header
 */

export const setDirLightSettings = header => {
    // get the hour element of this location
    let hourAtLatLong = new Date().toLocaleString("en-US", {
        timeZone: tzlookup(header.spatial.latitude, header.spatial.longitude),
        hour: "2-digit",
        hour12: false
    });

    // get the time in greenwich
    var greenwichDate = new Date();
    var greenwichHours = greenwichDate.getUTCHours();
    // calc the offset
    let timeZoneOffset = greenwichHours + 24 - parseInt(hourAtLatLong);
    return timeZoneOffset;
};

/**
 * Description. gets `props` with geojson
 * and procces the interactive area
 */
export const _proccessGridData = cityioData => {
    let types = settings.map.types;
    const TUIgridData = cityioData.grid;

    const wholeGrid = cityioData.meta_grid;
    const interactiveGridData = cityioData.interactive_grid_data;
    // update meta_grid features from cityio
    if (interactiveGridData) {
        for (let i = 0; i < wholeGrid.features.length; i++) {
            wholeGrid.features[i].properties = interactiveGridData[i];
        }
    }

    // handles TUI grid data on update
    const interactiveMapping = cityioData.interactive_grid_mapping;
    for (let i in interactiveMapping) {
        // type is the first value in the cell array
        // the rotation is the 2nd
        let gridCellType = TUIgridData[i][0];
        let interactiveCellProps =
            wholeGrid.features[interactiveMapping[i]].properties;
        // set up the cell type
        interactiveCellProps.type = gridCellType;

        // check if not undefined type (no scanning)

        if (TUIgridData[i][0] !== -1) {
            // get value of cell from settings via its index
            let cellValueByIndex = Object.values(types)[TUIgridData[i][0]];
            // cast the cell color
            interactiveCellProps.color = cellValueByIndex.color;
            // cast the cell height
            interactiveCellProps.height = cellValueByIndex.height;
        } else {
            console.log("... got null type...");
        }
    }
    const newGrid = JSON.parse(JSON.stringify(wholeGrid));
    return newGrid;
};

/**
 * proccess grid data to geojson
 * of lineStrings
 * @param {cityIOdata} data
 * 
 
features  :[
    {
        type: "Feature",
        properties: {},
        geometry: {
            type: "Point",
            coordinates: [125.6, 10.1]
        },
        properties: {
            name: "Dinagat Islands"
        }
    }...
]
 */

export const _proccesnetworkGeojson = cityioData => {
    const metaGrid = cityioData.meta_grid.features;
    const networkGeojson = {
        type: "FeatureCollection",
        features: []
    };
    // update meta_grid features from cityio
    if (metaGrid) {
        for (let i = 0; i < metaGrid.length; i++) {
            const pnttLatLong = metaGrid[i].geometry.coordinates[0][0];
            let id = i;
            let props;
            if (cityioData.interactive_network_data) {
                props = cityioData.interactive_network_data[id];
            } else {
                const noneType = settings.map.netTypes[0];
                props = {
                    land_use: "network",
                    netWidth: noneType.width,
                    color: noneType.color,
                    id: "0"
                };
            }
            const pnt = {
                type: "Feature",
                properties: props,
                geometry: {
                    type: "Point",
                    coordinates: pnttLatLong
                }
            };
            networkGeojson.features.push(pnt);
        }
    }
    return networkGeojson;
};

/**
 * Data format:
 * [
 *   {text: 'type', coordinates: [-122.466233, 37.684638]},
 *   ...
 * ]
 *
 * Grid data format:
 * features[i].geometry.coordinates[0][0]
 */
export const _proccessGridTextData = data => {
    const meta_grid = data.meta_grid;
    let textData = [];
    for (let i = 0; i < meta_grid.features.length; i++) {
        textData[i] = {
            text: meta_grid.features[i].properties.height.toString(),
            coordinates: [
                meta_grid.features[i].geometry.coordinates[0][0][0],
                meta_grid.features[i].geometry.coordinates[0][0][1],
                meta_grid.features[i].properties.height + 10
            ]
        };
    }
    return textData;
};

/**
 * Description. gets `props` with geojson
 * and procces the access layer data
 */
export const _proccessAccessData = data => {
    const accessData = data.access;
    // get colors from settings
    let coordinates = accessData.features.map(d => d.geometry.coordinates);
    let values = accessData.features.map(d => d.properties);
    let heatmap = [];
    for (let i = 0; i < coordinates.length; i++) {
        heatmap.push({
            coordinates: coordinates[i],
            values: values[i]
        });
    }
    return heatmap;
};

/**
 * checks if edits are done (toggled off)
 * than returns a redux state
 * with grid edits payload
 */
export const _postMapEditsToCityIO = (data, tableName, endPoint) => {
    let dataProps = [];
    for (let i = 0; i < data.features.length; i++) {
        dataProps[i] = data.features[i].properties;
    }

    axios
        .post(
            "https://cityio.media.mit.edu/api/table/update/" +
                tableName +
                endPoint,
            dataProps
        )
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        });
};
