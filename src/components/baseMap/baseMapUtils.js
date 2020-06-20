import settings from "../../settings/settings.json";
import axios from "axios";

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

/*
const _handleTUIgridUpdate = (cityioData) => {

    // handles TUI grid data on update
    const geoGridMapping = cityioData.GEOGRID.properties.geogrid_to_tui_mapping;
    let counter = 0;
    for (let thisCellMapping in geoGridMapping) {
        // type is the first value in the cell array
        // the rotation is the 2nd
        let gridCellType = TUIgridData[counter][0];
        let interactiveCellProps = GEOGRID.features[thisCellMapping].properties;
        // set up the cell type
        interactiveCellProps.type = gridCellType;
        // check if not undefined type (no scanning)
        if (TUIgridData[counter][0] !== -1) {
            // get value of cell from settings via its index
            let cellValueByIndex = Object.values(typesSettings)[
                TUIgridData[counter][0]
            ];
            // cast the cell color
            interactiveCellProps.color = cellValueByIndex.color;
            // cast the cell height
            interactiveCellProps.height = cellValueByIndex.height;
        } else {
            console.log("... got null type...");
        }
        counter = counter + 1;
    }
};
   */

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
    let postURL;
    // check if cityIO or local server
    postURL =
        tableName === "mockAPI"
            ? settings.cityIO.mockURL + endPoint
            : "https://cityio.media.mit.edu/api/table/update/" +
              tableName +
              endPoint;

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
