import React from "react";
import { useSelector } from "react-redux";
import { Tooltip, Button } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import NearMeIcon from "@material-ui/icons/NearMe";
import NavigationIcon from "@material-ui/icons/Navigation";

export default function FABMenu(props) {
    const menuState = useSelector((state) => state.MENU);
    const { handleToggle } = props;

    return (
        <>
            <Tooltip title="Toggle Edit Grid Mode, send to cityIO">
                <Button color="default" onClick={handleToggle("EDIT")}>
                    {menuState.includes("EDIT") ? (
                        <CloudUploadIcon />
                    ) : (
                        <EditIcon />
                    )}
                </Button>
            </Tooltip>

            <Tooltip title="Reset View/Toggle Ortho">
                <Button color="default" onClick={handleToggle("RESET_VIEW")}>
                    {menuState.includes("RESET_VIEW") ? (
                        <NavigationIcon />
                    ) : (
                        <NearMeIcon />
                    )}
                </Button>
            </Tooltip>
        </>
    );
}
