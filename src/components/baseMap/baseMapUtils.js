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
        timeZone: tzlookup(header.latitude, header.longitude),
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

    const wholeGrid = cityioData.GEOGRID;
    const interactiveGridData = cityioData.interactive_grid_data;
    // update GEOGRID features from cityio
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

export const _proccesNetworkPnts = cityioData => {
    const metaGrid = cityioData.GEOGRID.features;
    // pnt object
    const networkGeojson = {
        type: "FeatureCollection",
        features: []
    };

    const gridRows = cityioData.GEOGRID.properties.header.nrows;
    const gridCols = cityioData.GEOGRID.properties.header.ncols;

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
    const GEOGRID = cityioData.GEOGRID;
    let textData = [];

    const gridRows = cityioData.GEOGRID.properties.header.nrows;
    const gridCols = cityioData.GEOGRID.properties.header.ncols;

    let counter = 0;
    for (let cell = 0; cell < gridRows; cell++) {
        for (var col = 0; col < gridCols; col++) {
            textData[counter] = {
                text: [
                    col,
                    cell
                    // " | ",
                    // GEOGRID.features[counter].geometry.coordinates[0][0][0],
                    // GEOGRID.features[counter].geometry.coordinates[0][0][1]
                ].toString(),

                // [col, cell].toString(),
                coordinates: [
                    GEOGRID.features[counter].geometry.coordinates[0][0][0],
                    GEOGRID.features[counter].geometry.coordinates[0][0][1],
                    GEOGRID.features[counter].properties.height + 10
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

export const _proccessBresenhamGrid = cityioData => {
    let bresenhamGrid = {};
    const metaGrid = cityioData.GEOGRID.features;
    const gridRows = cityioData.GEOGRID.properties.header.nrows;
    const gridCols = cityioData.GEOGRID.properties.header.ncols;

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
export const _bresenhamLine = (x0, y0, x1, y1, bresenhamGrid) => {
    // search for latLong for this pixel
    const _pushTobresenhamLine = (x, y) => {
        let posString = [x, y].toString();
        pathArr.push(bresenhamGrid[posString]);
    };
    let pathArr = [];
    // Iterators, counters required by algorithm
    let xWalker,
        yWalker,
        deltaX,
        deltaY,
        absDeltaX,
        absDeltaY,
        errX,
        errY,
        xDestination,
        yDestination,
        step;
    // Calculate line deltas
    deltaX = x1 - x0;
    deltaY = y1 - y0;
    // Create a positive copy of deltas (makes iterating easier)
    absDeltaX = Math.abs(deltaX);
    absDeltaY = Math.abs(deltaY);
    // Calculate error intervals for both axis
    errX = 2 * absDeltaY - absDeltaX;
    errY = 2 * absDeltaX - absDeltaY;
    // The line is X-axis dominant
    if (absDeltaY <= absDeltaX) {
        // Line is drawn left to right
        if (deltaX >= 0) {
            xWalker = x0;
            yWalker = y0;
            xDestination = x1;
        }
        // Line is drawn right to left (swap ends)
        else {
            xWalker = x1;
            yWalker = y1;
            xDestination = x0;
        }
        // Push first pixel
        _pushTobresenhamLine(xWalker, yWalker);
        // Rasterize the line
        for (step = 0; xWalker < xDestination; step++) {
            // move one step on x
            xWalker = xWalker + 1;
            // errX is smaller than 0
            if (errX < 0) {
                errX = errX + 2 * absDeltaY;
                _pushTobresenhamLine(xWalker, yWalker);
            }
            // errX is larger than 0
            else {
                if ((deltaX < 0 && deltaY < 0) || (deltaX > 0 && deltaY > 0)) {
                    yWalker = yWalker + 1;
                } else {
                    yWalker = yWalker - 1;
                }
                errX = errX + 2 * (absDeltaY - absDeltaX);
                // push pnt that stays on x for the y+1 step
                // so that the a 90deg step is created
                _pushTobresenhamLine(xWalker - 1, yWalker);
            }
            _pushTobresenhamLine(xWalker, yWalker);
        }
    }
    // The line is Y-axis dominant
    else if (absDeltaY > absDeltaX) {
        // Line is drawn bottom to top
        if (deltaY >= 0) {
            xWalker = x0;
            yWalker = y0;
            yDestination = y1;
        } else {
            // Line is drawn top to bottom
            xWalker = x1;
            yWalker = y1;
            yDestination = y0;
        }
        _pushTobresenhamLine(xWalker, yWalker); // Draw first pixel
        // Rasterize the line
        for (step = 0; yWalker < yDestination; step++) {
            // move y
            yWalker = yWalker + 1;
            if (errY <= 0) {
                errY = errY + 2 * absDeltaX;
                _pushTobresenhamLine(xWalker, yWalker);
            } else {
                if ((deltaX < 0 && deltaY < 0) || (deltaX > 0 && deltaY > 0)) {
                    xWalker = xWalker + 1;
                } else {
                    xWalker = xWalker - 1;
                }
                errY = errY + 2 * (absDeltaX - absDeltaY);
                _pushTobresenhamLine(xWalker, yWalker - 1);
            }
            _pushTobresenhamLine(xWalker, yWalker);
        }
    }
    return pathArr;
};
