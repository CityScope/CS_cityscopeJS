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

        // // fixes JSON => string in material-table
        // newTypesList[oldType.name].LBCS = JSON.parse(
        //     JSON.stringify(oldType.LBCS)
        // );
        // newTypesList[oldType.name].NAICS = JSON.parse(
        //     JSON.stringify(oldType.NAICS)
        // );
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

        const options = {
            method: "post",
            url: requestsList.geoGridURL,
            data: geoGridObj,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };

        axios(options)
            .then(function (response) {
                setReqResonse(reqResonseUI(response, tableName));
            })
            // then reset GEOGRIDDATA of that new grid

            .then(function () {
                options.url = requestsList.geoGridDataURL;
                options.data = {};
                axios(options);
                console.log("removed GEOGRIDDATA");
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
