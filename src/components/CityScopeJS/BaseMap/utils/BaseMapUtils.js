import axios from "axios";
import { addLoadingModules } from "../../../../redux/actions";
import store from "../../../../redux/store";
import settings from "../../../../settings/settings.json";

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
    const expectUpdateModules = new Set(
        settings.cityIO.cityIOmodules
            .filter((val) => val.expectUpdate)
            .map((val) => val.name)
    );
    const cityIOKeys = new Set(Object.keys(store.getState().CITYIO));

    const loadingModules = [...cityIOKeys].filter((i) =>
        expectUpdateModules.has(i)
    );

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
    axios(options)
        .then((res) => {
            if (res.data.status === "ok") {
                store.dispatch(addLoadingModules(loadingModules));
            }
        })
        .catch((error) => {
            console.log("ERROR:", error);
        });
};

// /**
//  * Description. uses deck api to
//  * collect objects in a region
//  * @argument{object} e  picking event
//  */
export const _multipleObjPicked = (e, pickingRadius, deckGLRef) => {
    const dim = pickingRadius;
    const x = e.x - dim / 2;
    const y = e.y - dim / 2;
    let multipleObj = deckGLRef.current.pickObjects({
        x: x,
        y: y,
        width: dim,
        height: dim,
    });
    return multipleObj;
};

// /**
//  * Description. allow only to pick cells that are
//  *  not of CityScope TUI & that are interactable
//  * so to not overlap TUI activity
//  */
export const _handleGridcellEditing = (
    e,
    selectedType,
    setSelectedCellsState,
    pickingRadius,
    deckGLRef
) => {
    const { height, color, name } = selectedType;
    const multiSelectedObj = _multipleObjPicked(e, pickingRadius, deckGLRef);
    multiSelectedObj.forEach((selected) => {
        const thisCellProps = selected.object.properties;
        if (thisCellProps && thisCellProps.interactive) {
            thisCellProps.color = testHex(color) ? hexToRgb(color) : color;
            thisCellProps.height = height;
            thisCellProps.name = name;
        }
    });
    setSelectedCellsState(multiSelectedObj);
};
