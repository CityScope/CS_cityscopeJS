import React from "react";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import axios from "axios";
import settings from "../../../GridEditorSettings.json";
import Typography from "@material-ui/core/Typography";
import { useSelector } from "react-redux";
import Link from "@material-ui/core/Link";

/**
 *
 * @param {typesList} typesList List of types form table editor
 *
 */
const prepareTypesList = (typesList) => {
    let newTypesList = {};
    typesList.forEach((oldType) => {
        newTypesList[oldType.name] = oldType;

        // fixes JSON => string in material-table
        newTypesList[oldType.name].LBCS = JSON.parse(
            JSON.stringify(oldType.LBCS)
        );
        newTypesList[oldType.name].NAICS = JSON.parse(
            JSON.stringify(oldType.NAICS)
        );
    });

    return newTypesList;
};

export default function CommitGrid(props) {
    // take grid struct from settings
    let geoGridObj = settings.GEOGRID;
    // inject table props to grid
    geoGridObj.properties.header = props.gridProps;
    geoGridObj.properties.header.longitude = parseFloat(
        geoGridObj.properties.header.longitude
    );
    console.log(geoGridObj.properties.header.longitude);

    geoGridObj.properties.header.latitude = parseFloat(
        geoGridObj.properties.header.latitude
    );
    geoGridObj.properties.header.rotation = parseFloat(
        geoGridObj.properties.header.rotation
    );
    geoGridObj.properties.header.nrows = parseFloat(
        geoGridObj.properties.header.nrows
    );
    geoGridObj.properties.header.ncols = parseFloat(
        geoGridObj.properties.header.ncols
    );
    geoGridObj.properties.header.cellSize = parseFloat(
        geoGridObj.properties.header.cellSize
    );

    const [reqResonse, setReqResonse] = React.useState(null);

    const reduxState = useSelector((state) => state);
    const hasGrid = reduxState.GRID_CREATED;

    // if grid was created, and is on redux
    if (hasGrid) {
        geoGridObj.features = reduxState.GRID_CREATED.features;
        // prepare type to csJS format
        geoGridObj.properties.types = prepareTypesList(reduxState.TYPES_LIST);
    }

    const postToCityIO = () => {
        let tableName = geoGridObj.properties.header.tableName.toLowerCase();
        let reqList = {
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
            url: reqList.geoGridURL,
            data: geoGridObj,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };

        axios(options)
            .then(function (response) {
                reqResonseTag(response, tableName);
            })
            // then reset GEOGRIDDATA of that new grid

            .then(function () {
                options.url = reqList.geoGridDataURL;
                options.data = {};
                axios(options);
                console.log("removed GEOGRIDDATA");
            })
            .catch((error) => {
                console.log("ERROR:", error);
            });
    };

    const reqResonseTag = (response, tableName) => {
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

        setReqResonse(resText);
    };
    return (
        <>
            {hasGrid && (
                <>
                    <Button
                        onClick={() => {
                            postToCityIO();
                        }}
                        variant="outlined"
                        color="default"
                        startIcon={<CloudUploadIcon />}
                    >
                        Commit Grid to cityIO
                    </Button>
                    <div style={{ width: "100%" }}> {reqResonse}</div>
                </>
            )}
        </>
    );
}
