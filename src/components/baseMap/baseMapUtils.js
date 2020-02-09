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
            wholeGrid.features[i].properties.id = i;
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

export const _proccesNetworkGeojson = cityioData => {
    const metaGrid = cityioData.meta_grid.features;
    // pnt object
    const networkGeojson = {
        type: "FeatureCollection",
        features: []
    };

    const gridRows = cityioData.meta_grid_header.nrows;
    const gridCols = cityioData.meta_grid_header.ncols;

    let counter = 0;

    // create array for obstecles
    // and array for coordinates
    for (let cell = 0; cell < gridRows; cell++) {
        for (var col = 0; col < gridCols; col++) {
            let props;
            const pntLatLong = metaGrid[counter].geometry.coordinates[0][0];
            const typeProp = settings.map.netTypes[1];
            props = {
                land_use: "network",
                netWidth: typeProp.width,
                color: typeProp.color,
                gridPosition: [col, cell]
            };
            const pnt = {
                type: "Feature",
                properties: props,
                geometry: {
                    type: "Point",
                    coordinates: pntLatLong
                }
            };
            networkGeojson.features.push(pnt);
            counter += 1;
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
export const _proccessGridTextData = cityioData => {
    const meta_grid = cityioData.meta_grid;
    let textData = [];

    const gridRows = cityioData.meta_grid_header.nrows;
    const gridCols = cityioData.meta_grid_header.ncols;

    let counter = 0;
    for (let cell = 0; cell < gridRows; cell++) {
        for (var col = 0; col < gridCols; col++) {
            textData[counter] = {
                text: [col, cell].toString(),
                coordinates: [
                    meta_grid.features[counter].geometry.coordinates[0][0][0],
                    meta_grid.features[counter].geometry.coordinates[0][0][1],
                    meta_grid.features[counter].properties.height + 10
                ]
            };
            counter += 1;
        }
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
    let postURL;
    // check if cityIO or local server
    if (tableName === "mockAPI") {
        postURL = settings.cityIO.mockURL + endPoint;
    } else {
        postURL =
            "https://cityio.media.mit.edu/api/table/update/" +
            tableName +
            endPoint;
    }

    axios
        .post(postURL, data, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        });
};

// _handleCellsHeight(flat) {
//     let grid = this.state.meta_grid.features;

//     grid.forEach(cell => {
//         const thisCellProps = cell.properties;
//         if (flat) {
//             thisCellProps.old_height = thisCellProps.height;
//             thisCellProps.flat = true;
//             thisCellProps.height = 0.1;
//         } else {
//             thisCellProps.flat = false;
//             thisCellProps.height = thisCellProps.old_height;
//         }
//     });
//     // make react think of a new obj: hack
//     grid = JSON.parse(JSON.stringify(grid));
//     this.setState({
//         selectedCellsState: grid
//     });
// }
