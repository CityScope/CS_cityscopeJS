import React from "react";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import axios from "axios";
import settings from "../../../GridEditorSettings.json";
import Typography from "@material-ui/core/Typography";
import { useSelector } from "react-redux";
import Link from "@material-ui/core/Link";

const reqResonseUI = (response, tableName) => {
    let cityscopeJSendpoint =
        "https://cityscope.media.mit.edu/CS_cityscopeJS/?cityscope=" +
        tableName;
    // create the feedback text
    let resText = (
        <Typography variant="caption">
            CityIO is {response.data.status}. Grid deployed to{" "}
            <Link href={cityscopeJSendpoint}>{cityscopeJSendpoint}</Link>
        </Typography>
    );

    return resText;
};

/**
 *
 * @param {typesList} typesList List of types form table editor
 *
 */
const prepareData = (struct, typesList, geoJsonFeatures, gridProps) => {
    let geoGridObject = struct;

    // take types list and prepare to csJS format
    let newTypesList = {};

    typesList.forEach((oldType) => {
        newTypesList[oldType.name] = oldType;
        //material-table creates strings for these items
        // so in first "Commit to cityIO", these must be turned into
        // Json objects. On Second commit, these are already objects,
        // hence the two conditions below

        newTypesList[oldType.name].LBCS =
            typeof oldType.LBCS == "string"
                ? JSON.parse(oldType.LBCS)
                : oldType.LBCS;
        newTypesList[oldType.name].NAICS =
            typeof oldType.NAICS == "string"
                ? JSON.parse(oldType.NAICS)
                : oldType.NAICS;
    });

    geoGridObject.properties.types = newTypesList;

    // inject table props to grid
    geoGridObject.properties.header = gridProps;
    geoGridObject.properties.header.longitude = parseFloat(
        geoGridObject.properties.header.longitude
    );
    geoGridObject.properties.header.latitude = parseFloat(
        geoGridObject.properties.header.latitude
    );
    geoGridObject.properties.header.rotation = parseFloat(
        geoGridObject.properties.header.rotation
    );
    geoGridObject.properties.header.nrows = parseFloat(
        geoGridObject.properties.header.nrows
    );
    geoGridObject.properties.header.ncols = parseFloat(
        geoGridObject.properties.header.ncols
    );
    geoGridObject.properties.header.cellSize = parseFloat(
        geoGridObject.properties.header.cellSize
    );

    // lastly get the grid features
    geoGridObject.features = geoJsonFeatures;
    return geoGridObject;
};

export default function CommitGrid(props) {
    const [reqResonse, setReqResonse] = React.useState(null);

    const reduxState = useSelector((state) => state);
    const hasGrid = reduxState.GRID_CREATED;

    const downloadObjectAsJson = () => {
        let struct = settings.GEOGRID;
        let typesList = reduxState.TYPES_LIST;
        let geoJsonFeatures = reduxState.GRID_CREATED.features;
        let gridProps = props.gridProps;
        let geoGridObj = prepareData(
            struct,
            typesList,
            geoJsonFeatures,
            gridProps
        );
        var dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(geoGridObj));
        var downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "grid.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const postGridToCityIO = () => {
        let struct = settings.GEOGRID;
        let typesList = reduxState.TYPES_LIST;
        let geoJsonFeatures = reduxState.GRID_CREATED.features;
        let gridProps = props.gridProps;
        // take grid struct from settings
        let geoGridObj = prepareData(
            struct,
            typesList,
            geoJsonFeatures,
            gridProps
        );

        let tableName = geoGridObj.properties.header.tableName.toLowerCase();
        let requestsList = {
            geoGridURL:
                "https://cityio.media.mit.edu/api/table/update/" +
                tableName +
                "/GEOGRID",

            geoGridDataURL:
                "https://cityio.media.mit.edu/api/table/update/" +
                tableName +
                "/GEOGRIDDATA",
        };

        const geoGridOptions = (URL, DATA) => {
            return {
                method: "post",
                url: URL,
                data: DATA,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            };
        };

        axios(geoGridOptions(requestsList.geoGridURL, geoGridObj))
            .then(function (response) {
                setReqResonse(reqResonseUI(response, tableName));
            })
            // then reset GEOGRIDDATA of that new grid

            .then(function () {
                axios(geoGridOptions(requestsList.geoGridDataURL, {}));
                console.log("removed GEOGRIDDATA");
            })
            .then(function () {
                axios(geoGridOptions(requestsList.geoGridDataURL, geoGridObj));
                console.log("mirrored GEOGRID to GEOGRIDDATA");
            })
            .catch((error) => {
                console.log("ERROR:", error);
            });
    };

    return (
        <>
            {hasGrid && (
                <>
                    <Button
                        onClick={() => {
                            postGridToCityIO();
                        }}
                        variant="outlined"
                        color="default"
                        startIcon={<CloudUploadIcon />}
                    >
                        Commit Grid to cityIO
                    </Button>

                    <Button
                        onClick={() => {
                            // ! download as json
                            downloadObjectAsJson();
                        }}
                        variant="outlined"
                        color="default"
                        startIcon={<CloudDownloadIcon />}
                    >
                        Download JSON
                    </Button>

                    <div style={{ width: "100%" }}> {reqResonse}</div>
                </>
            )}
        </>
    );
}
