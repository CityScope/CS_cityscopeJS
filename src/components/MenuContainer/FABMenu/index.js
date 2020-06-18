import React from "react";
import { useSelector } from "react-redux";
import Fab from "@material-ui/core/Fab";
import MenuIcon from "@material-ui/icons/Menu";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import NearMeIcon from "@material-ui/icons/NearMe";
import NavigationIcon from "@material-ui/icons/Navigation";
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
    const { handleToggle, toggleDrawer } = props;

    return (
        <List className={classes.root}>
            <ListItem>
                <Tooltip title="Open Layer + Settings Menu">
                    <Fab
                        onClick={toggleDrawer}
                        style={{ backgroundColor: "#616161" }}
                    >
                        <MenuIcon style={{ color: "FFF" }} />
                    </Fab>
                </Tooltip>
            </ListItem>
            <ListItem>
                <Tooltip title="Toggle Edit Grid Mode, send to cityIO">
                    <Fab
                        onClick={handleToggle("EDIT")}
                        style={{ backgroundColor: "#616161" }}
                    >
                        {menuState.includes("EDIT") ? (
                            <CancelIcon style={{ color: "e91e63" }} />
                        ) : (
                            <EditIcon style={{ color: "FFF" }} />
                        )}
                    </Fab>
                </Tooltip>
            </ListItem>
            <ListItem>
                <Tooltip title="Reset View/Toggle Ortho">
                    <Fab
                        onClick={handleToggle("RESET_VIEW")}
                        style={{ backgroundColor: "#616161" }}
                    >
                        {menuState.includes("RESET_VIEW") ? (
                            <NavigationIcon style={{ color: "FFF" }} />
                        ) : (
                            <NearMeIcon style={{ color: "FFF" }} />
                        )}
                    </Fab>
                </Tooltip>
            </ListItem>
        </List>
    );
}
