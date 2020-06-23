import React from "react";
import AppsIcon from "@material-ui/icons/Apps";
import Button from "@material-ui/core/Button";
import { gridCreator } from "./gridCreator";
import { listenToGridCreator } from "../../../../../redux/actions";
import { useDispatch } from "react-redux";

export default function GridMaker(props) {
    const dispatch = useDispatch();

    // function downloadObjectAsJson(exportObj) {
    //     var dataStr =
    //         "data:text/json;charset=utf-8," +
    //         encodeURIComponent(JSON.stringify(exportObj));
    //     var downloadAnchorNode = document.createElement("a");
    //     downloadAnchorNode.setAttribute("href", dataStr);
    //     downloadAnchorNode.setAttribute("download", "grid.json");
    //     document.body.appendChild(downloadAnchorNode); // required for firefox
    //     downloadAnchorNode.click();
    //     downloadAnchorNode.remove();
    // }

    const handleGridCreation = () => {
        let grid = gridCreator(props.gridProps);
        // downloadObjectAsJson(grid);
        dispatch(listenToGridCreator(grid));
    };

    return (
        <Button
            onClick={() => {
                handleGridCreation();
            }}
            variant="outlined"
            color="default"
            startIcon={<AppsIcon />}
        >
            Create Grid
        </Button>
    );
}
