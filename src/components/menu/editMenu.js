import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import SaveIcon from "@material-ui/icons/Save";
import Fab from "@material-ui/core/Fab";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles(theme => ({
    list: {
        width: 200
    },
    fullList: {
        width: "auto"
    },
    root: {
        "& > *": {
            margin: theme.spacing(1)
        }
    },
    extendedIcon: {
        marginRight: theme.spacing(1)
    },
    menuButton: {
        position: "absolute",
        top: theme.spacing(2),
        left: theme.spacing(2)
    }
}));

export default function EditMenu() {
    const classes = useStyles();
    const [state, setState] = React.useState({
        right: false
    });

    const toggleDrawer = (side, open) => event => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setState({ ...state, [side]: open });
    };

    const sideList = side => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
        >
            <List>
                <ListItem button key="Save">
                    <ListItemIcon>
                        <SaveIcon />
                    </ListItemIcon>
                    <ListItemText primary="Save" />
                </ListItem>

                <ListItem button key="Recompute">
                    <ListItemIcon>
                        <ImportExportIcon />
                    </ListItemIcon>
                    <ListItemText primary="Compute" />
                </ListItem>

                <ListItem button key="Logout">
                    <ListItemIcon>
                        <VpnKeyIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </div>
    );

    return (
        <div className={classes.root}>
            <Drawer
                anchor="right"
                open={state.right}
                onClose={toggleDrawer("right", false)}
            >
                {sideList("right")}
            </Drawer>

            <Fab
                aria-label="add"
                className={classes.menuButton}
                onClick={toggleDrawer("right", true)}
            >
                <MenuIcon />
            </Fab>
        </div>
    );
}
