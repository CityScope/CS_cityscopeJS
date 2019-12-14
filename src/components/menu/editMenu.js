import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import SaveIcon from "@material-ui/icons/Save";

const useStyles = makeStyles({
    list: {
        width: 200
    },
    fullList: {
        width: "auto"
    }
});

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

                <ListItem button key="Compute">
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
        <div>
            <Button onClick={toggleDrawer("right", true)}>Editing Menu</Button>

            <Drawer
                anchor="right"
                open={state.right}
                onClose={toggleDrawer("right", false)}
            >
                {sideList("right")}
            </Drawer>
        </div>
    );
}
