import React from "react";
import { useStyles } from "./styles";
import { useSelector } from "react-redux";
import Fab from "@material-ui/core/Fab";
import MenuIcon from "@material-ui/icons/Menu";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import NearMeIcon from "@material-ui/icons/NearMe";
import NavigationIcon from "@material-ui/icons/Navigation";

export default function FABMenu(props) {
    const classes = useStyles();

    const menuState = useSelector(state => state.MENU);
    const scenario = useSelector(state => state.SCENARIO);

    const { handleToggle, toggleDrawer } = props;

    return (
        <div className={classes.root}>
            <Fab
                className={classes.menuButton}
                onClick={toggleDrawer}
                style={{ backgroundColor: "#1D1F21" }}
            >
                <MenuIcon style={{ color: "FFF" }} />
            </Fab>
            <Fab
                className={classes.editButton}
                classes={{ root: classes.fab, disabled: classes.disabled }}
                disabled={!!scenario}
                onClick={() => handleToggle("EDIT")}
                style={{ backgroundColor: "#1D1F21" }}
            >
                {menuState.includes("EDIT") ? (
                    <CancelIcon style={{ color: "FFF" }} />
                ) : (
                    <EditIcon style={{ color: "FFF" }} />
                )}
            </Fab>
            <Fab
                className={classes.resetViewButton}
                onClick={() => handleToggle("RESET_VIEW")}
                style={{ backgroundColor: "#1D1F21" }}
            >
                {menuState.includes("RESET_VIEW") ? (
                    <NavigationIcon style={{ color: "FFF" }} />
                ) : (
                    <NearMeIcon style={{ color: "FFF" }} />
                )}
            </Fab>
            <Fab
                className={classes.templatesButton}
                onClick={() => handleToggle("SCENARIOS")}
                style={{ backgroundColor: "#1D1F21" }}
            >
                <InsertDriveFileIcon style={{ color: "FFF" }} />
            </Fab>
        </div>
    );
}
