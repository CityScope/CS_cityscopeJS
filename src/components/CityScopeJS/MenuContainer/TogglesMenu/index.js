import React from "react";
import { useSelector } from "react-redux";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import settings from "../../../../settings/settings.json";
import Collapse from "@material-ui/core/Collapse";
import ABMSubmenu from "./ABMSubmenu";
import ShadowSubmenu from "./ShadowSubmenu";
import AccessSubmenu from "./AccessSubmenu";
import Switch from "@material-ui/core/Switch";
import { makeStyles } from "@material-ui/core/styles";
import Close from "@material-ui/icons/Cancel";
import Fab from "@material-ui/core/Fab";

function TogglesMenu(props) {
    let drawerWidth = 300;
    const useStyles = makeStyles((theme) => ({
        drawer: {
            display: "flex",
            paddingLeft: 16,
            paddingRight: 16,
            width: drawerWidth,
            padding: theme.spacing(0, 1),
        },
        drawerPaper: {
            width: drawerWidth,
        },
    }));

    const classes = useStyles();
    const { open, toggleDrawer, handleToggle } = props;

    const { menuState, cityioData } = useSelector((state) => ({
        menuState: state.MENU,
        cityioData: state.CITYIO,
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
                            <Switch
                                edge="end"
                                onChange={handleToggle(listOfToggles[i])}
                                checked={checked}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>

                    {
                        // ! Handle submenus of ABM/ACCESS

                        listOfToggles[i] === "SHADOWS" && (
                            <Collapse in={checked} style={{ width: "100%" }}>
                                <ShadowSubmenu />
                            </Collapse>
                        )
                    }

                    {
                        // ! Handle submenus of ABM/ACCESS

                        listOfToggles[i] === "ABM" && (
                            <Collapse in={checked} style={{ width: "100%" }}>
                                <ABMSubmenu tripsData={cityioData.ABM2.attr} />
                            </Collapse>
                        )
                    }
                    {listOfToggles[i] === "ACCESS" && (
                        <Collapse
                            in={checked}
                            style={{
                                width: "80%",
                                marginLeft: 24,
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
            elevation={3}
            className={classes.drawer}
            classes={{
                paper: classes.drawerPaper,
            }}
            BackdropProps={{
                invisible: true,
            }}
            anchor="left"
            open={open}
            variant="persistent"
        >
            <List className={classes.list}>
                <ListItem
                    style={{ display: "flex", justifyContent: "flex-end" }}
                >
                    <Fab color="default" onClick={toggleDrawer}>
                        <Close />
                    </Fab>
                </ListItem>
                <ListItem>
                    <Typography variant="h5" gutterBottom>
                        MIT CityScope
                    </Typography>
                </ListItem>

                <ListItem>
                    <Typography variant="caption" gutterBottom>
                        Toggle CityScope layers visability
                    </Typography>
                </ListItem>
                {togglesCompsArray}
            </List>
        </Drawer>
    );
}

export default TogglesMenu;
