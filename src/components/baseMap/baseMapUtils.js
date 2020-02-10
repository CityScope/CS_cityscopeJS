import settings from "../../settings/settings.json";
import axios from "axios";
import { errorStyle } from "../../services/consoleStyle";
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
                text: [
                    col,
                    cell,
                    " | ",
                    meta_grid.features[counter].geometry.coordinates[0][0][0],
                    meta_grid.features[counter].geometry.coordinates[0][0][1]
                ].toString(),

                // [col, cell].toString(),
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

    console.log("POSTing to", postURL);

    axios
        .post(postURL, data, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log("%c" + error, errorStyle);

            console.log("ERROR:", error);
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

export const _proccessBresenhamGrid = cityioData => {
    let bresenhamGrid = {};
    const metaGrid = cityioData.meta_grid.features;
    const gridRows = cityioData.meta_grid_header.nrows;
    const gridCols = cityioData.meta_grid_header.ncols;

    let counter = 0;
    for (let row = 0; row < gridRows; row++) {
        for (var col = 0; col < gridCols; col++) {
            const pntLatLong = metaGrid[counter].geometry.coordinates[0][0];
            let posString = [col, row].toString();
            bresenhamGrid[posString] = pntLatLong;
            counter += 1;
        }
    }
    return bresenhamGrid;
};

/**
 * https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
 */
export const _bresenhamLine = (x1, y1, x2, y2, bresenhamGrid) => {
    // search for latLong for this pixel
    const _pushTobresenhamLine = (x, y) => {
        let posString = [x, y].toString();
        pathArr.push(bresenhamGrid[posString]);
    };

    let pathArr = [];
    // Iterators, counters required by algorithm
    let x, y, deltaX, deltaY, absDeltaX, absDeltaY, px, py, xe, ye, counter;
    // Calculate line deltas
    deltaX = x2 - x1;
    deltaY = y2 - y1;
    // Create a positive copy of deltas (makes iterating easier)
    absDeltaX = Math.abs(deltaX);
    absDeltaY = Math.abs(deltaY);
    // Calculate error intervals for both axis
    px = 2 * absDeltaY - absDeltaX;
    py = 2 * absDeltaX - absDeltaY;

    // The line is X-axis dominant
    if (absDeltaY <= absDeltaX) {
        // Line is drawn left to right
        if (deltaX >= 0) {
            x = x1;
            y = y1;
            xe = x2;
        } else {
            // Line is drawn right to left (swap ends)
            x = x2;
            y = y2;
            xe = x1;
        }
        // Draw first pixel
        _pushTobresenhamLine(x, y);
        // Rasterize the line
        for (counter = 0; x < xe; counter++) {
            x = x + 1;
            // Deal with octants...
            if (px < 0) {
                px = px + 2 * absDeltaY;
            } else {
                if ((deltaX < 0 && deltaY < 0) || (deltaX > 0 && deltaY > 0)) {
                    y = y + 1;
                } else {
                    y = y - 1;
                }
                px = px + 2 * (absDeltaY - absDeltaX);
            }
            // Draw pixel from line span at currently rasterized position
            _pushTobresenhamLine(x, y);
        }
    }
    // The line is Y-axis dominant
    else {
        // Line is drawn bottom to top
        if (deltaY >= 0) {
            x = x1;
            y = y1;
            ye = y2;
        } else {
            // Line is drawn top to bottom
            x = x2;
            y = y2;
            ye = y1;
        }
        _pushTobresenhamLine(x, y); // Draw first pixel
        // Rasterize the line
        for (counter = 0; y < ye; counter++) {
            y = y + 1;
            // Deal with octants...
            if (py <= 0) {
                py = py + 2 * absDeltaX;
            } else {
                if ((deltaX < 0 && deltaY < 0) || (deltaX > 0 && deltaY > 0)) {
                    x = x + 1;
                } else {
                    x = x - 1;
                }
                py = py + 2 * (absDeltaX - absDeltaY);
            }
            // Draw pixel from line span at currently rasterized position
            _pushTobresenhamLine(x, y);
        }
    }

    return pathArr;
};
