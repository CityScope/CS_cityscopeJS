import React from "react";
import { useStyles } from "./styles";
import { useSelector } from "react-redux";
import Fab from "@material-ui/core/Fab";
import MenuIcon from "@material-ui/icons/Menu";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import NearMeIcon from "@material-ui/icons/NearMe";
import NavigationIcon from "@material-ui/icons/Navigation";
import Tooltip from "@material-ui/core/Tooltip";

export default function FABMenu(props) {
    const classes = useStyles();

    const menuState = useSelector((state) => state.MENU);
    const { handleToggle, toggleDrawer } = props;

    return (
        <div className={classes.root}>
            <Tooltip title="Open Layer + Settings Menu">
                <Fab className={classes.menuButton} onClick={toggleDrawer}>
                    <MenuIcon />
                </Fab>
            </Tooltip>
            <Tooltip title="Toggle Edit Grid Mode">
                <Fab
                    className={classes.editButton}
                    onClick={handleToggle("EDIT")}
                >
                    {menuState.includes("EDIT") ? <CancelIcon /> : <EditIcon />}
                </Fab>
            </Tooltip>
            <Tooltip title="Reset View/Toggle Ortho">
                <Fab
                    className={classes.resetViewButton}
                    onClick={handleToggle("RESET_VIEW")}
                >
                    {menuState.includes("RESET_VIEW") ? (
                        <NavigationIcon />
                    ) : (
                        <NearMeIcon />
                    )}
                </Fab>
            </Tooltip>
        </div>
    );
}
