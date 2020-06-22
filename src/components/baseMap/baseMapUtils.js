import axios from "axios";

/**
 * conver rgb to hex
 */
export function rgbToHex(r, g, b) {
    function valToHex(c) {
        var hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }
    return "#" + valToHex(r) + valToHex(g) + valToHex(b);
}

/**
 * conver hex to rgb array
 */
export function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? [
              parseInt(result[1], 16),
              parseInt(result[2], 16),
              parseInt(result[3], 16),
          ]
        : null;
}

/**
 *
 * @param {string} hexString test if vaild 3->6 HEX color
 */
export const testHex = (hexString) => {
    let isHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(hexString);
    return isHex;
};

/**
 * Description. gets `props` with geojson
 * and procces the interactive area
 */
export const _proccessGridData = (cityioData) => {
    // get the static grid
    const GEOGRID = cityioData.GEOGRID;
    // if GEOGRRIDDATA exist and is the same length as our grid
    if (
        cityioData.GEOGRIDDATA &&
        cityioData.GEOGRIDDATA.length === cityioData.GEOGRID.features.length
    ) {
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
