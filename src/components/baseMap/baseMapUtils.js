import axios from "axios";

/**
 *
 * conver rgb to hex
 */
function valToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

export function rgbToHex(r, g, b) {
    return "#" + valToHex(r) + valToHex(g) + valToHex(b);
}

/**
 * Description. gets `props` with geojson
 * and procces the interactive area
 */
export const _proccessGridData = (cityioData) => {
    // get the static grid
    const GEOGRID = cityioData.GEOGRID;
    // if GEOGRRIDDATA exist
    if (cityioData.GEOGRIDDATA && cityioData.GEOGRIDDATA.length > 0) {
        // get the grid data
        const GEOGRIDDATA = cityioData.GEOGRIDDATA;
        // update GEOGRID features from GEOGRIDDATA on cityio
        for (let i = 0; i < GEOGRID.features.length; i++) {
            GEOGRID.features[i].properties = GEOGRIDDATA[i];
            // inject id
            GEOGRID.features[i].properties.id = i;
        }
    }
    const newGrid = JSON.parse(JSON.stringify(GEOGRID));
    return newGrid;
};

/**
 * Description. gets `props` with geojson
 * and procces the access layer data
 */
export const _proccessAccessData = (data) => {
    const accessData = data.access;
    // get colors from settings
    let coordinates = accessData.features.map((d) => d.geometry.coordinates);
    let values = accessData.features.map((d) => d.properties);
    let heatmap = [];
    for (let i = 0; i < coordinates.length; i++) {
        heatmap.push({
            coordinates: coordinates[i],
            values: values[i],
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
    let postURL =
        "https://cityio.media.mit.edu/api/table/update/" + tableName + endPoint;

    const options = {
        method: "post",
        url: postURL,
        data: data,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    };
    axios(options).catch((error) => {
        console.log(error);

        console.log("ERROR:", error);
    });
};
