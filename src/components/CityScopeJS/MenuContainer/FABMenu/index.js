import React from "react";
import { useSelector } from "react-redux";
import Fab from "@material-ui/core/Fab";
import MenuIcon from "@material-ui/icons/Menu";
import EditIcon from "@material-ui/icons/Edit";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import NearMeIcon from "@material-ui/icons/NearMe";
import NavigationIcon from "@material-ui/icons/Navigation";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import Tooltip from "@material-ui/core/Tooltip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/core/styles";

export default function FABMenu(props) {
    const useStyles = makeStyles({
        root: {
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            paddingLeft: 16,
            paddingTop: 8,
            zIndex: 1,
        },
    });

    const classes = useStyles();

    const menuState = useSelector((state) => state.MENU);
    const { handleToggle, toggleDrawer, toggleSaveDrawer } = props;

    return (
        <List className={classes.root}>
            <ListItem>
                <Tooltip title="Open Layer + Settings Menu">
                    <Fab color="default" onClick={toggleDrawer}>
                        <MenuIcon />
                    </Fab>
                </Tooltip>
            </ListItem>
            <ListItem>
                <Tooltip title="Toggle Edit Grid Mode, send to cityIO">
                    <Fab color="default" onClick={handleToggle("EDIT")}>
                        {menuState.includes("EDIT") ? (
                            <CloudUploadIcon />
                        ) : (
                            <EditIcon />
                        )}
                    </Fab>
                </Tooltip>
            </ListItem>
            <ListItem>
                <Tooltip title="Reset View/Toggle Ortho">
                    <Fab color="default" onClick={handleToggle("RESET_VIEW")}>
                        {menuState.includes("RESET_VIEW") ? (
                            <NavigationIcon />
                        ) : (
                            <NearMeIcon />
                        )}
                    </Fab>
                </Tooltip>
            </ListItem>
            <ListItem>
                <Tooltip title="Save/Load Scenario">
                    <Fab
                        disabled={menuState.includes("EDIT")}
                        color="default"
                        onClick={toggleSaveDrawer}
                    >
                        <InsertDriveFileIcon />
                    </Fab>
                </Tooltip>
            </ListItem>
        </List>
    );
}
