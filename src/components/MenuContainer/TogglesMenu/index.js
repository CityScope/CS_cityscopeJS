import React from "react";
import { useStyles, ColoredSwitch } from "./styles";
import { useSelector } from "react-redux";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import settings from "../../../settings/settings.json";
import Collapse from "@material-ui/core/Collapse";
import ABMSubmenu from "./ABMSubmenu";
import AccessSubmenu from "./AccessSubmenu";

function TogglesMenu(props) {
    const classes = useStyles();
    const { open, toggleDrawer, handleToggle } = props;

    const { menuState, cityioData } = useSelector(state => ({
        menuState: state.MENU,
        cityioData: state.CITYIO
    }));

    const togglesMeta = settings.menu.toggles;
    const listOfToggles = Object.keys(togglesMeta);

    /**
     * gets props with initial menu state
     * and turn on the layer on init
     */
    let togglesCompsArray = [];
    // array of loaded API modules
    const loadedModules = Object.keys(cityioData);
    // create each toggle
    for (let i = 0; i < listOfToggles.length; i++) {
        // check if the mdoule of this toggle
        // was loaded on the API
        let requireModule = togglesMeta[listOfToggles[i]].requireModule;

        const checked = menuState.includes(listOfToggles[i]) ? true : false;

        if (loadedModules.includes(requireModule) || requireModule === false) {
            const thisToggle = (
                <div key={listOfToggles[i]}>
                    <ListItem>
                        <ListItemText
                            primary={togglesMeta[listOfToggles[i]].displayName}
                        />
                        <ListItemSecondaryAction>
                            <ColoredSwitch
                                edge="end"
                                onChange={() => handleToggle(listOfToggles[i])}
                                checked={checked}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                    {listOfToggles[i] === "ABM" && (
                        <Collapse in={checked} style={{ width: "100%" }}>
                            <ABMSubmenu />
                        </Collapse>
                    )}
                    {listOfToggles[i] === "ACCESS" && (
                        <Collapse
                            in={checked}
                            style={{
                                width: "80%",
                                marginLeft: 24
                            }}
                        >
                            <AccessSubmenu cityioData={cityioData} />
                        </Collapse>
                    )}
                </div>
            );
            togglesCompsArray.push(thisToggle);
        }
    }

    return (
        <Drawer
            className={classes.root}
            BackdropProps={{
                invisible: true
            }}
            classes={{
                paper: classes.paper
            }}
            anchor="left"
            open={open}
            onClose={toggleDrawer}
        >
            <List className={classes.list}>
                <Typography variant="h5" className={classes.text} gutterBottom>
                    CityScopeJS
                </Typography>
                {togglesCompsArray}
            </List>
        </Drawer>
    );
}

export default TogglesMenu;
