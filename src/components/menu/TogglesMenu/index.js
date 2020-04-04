import React from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";
import settings from "../../../settings/settings.json";
import Collapse from "@material-ui/core/Collapse";
import RangeSlider from "../ABMSubmenu/RangeSlider";
import AccessSubmenu from "../AccessSubmenu";

import { connect } from "react-redux";

function TogglesMenu(props) {
    const { open, toggleDrawer, classes, handleToggle } = props;

    const togglesMeta = settings.menu.toggles;
    const listOfToggles = Object.keys(togglesMeta);

    /**
     * gets props with initial menu state
     * and turn on the layer on init
     */
    let togglesCompsArray = [];
    // array of loaded API modules
    const loadedModules = Object.keys(props.cityIOdata);
    // create each toggle
    for (let i = 0; i < listOfToggles.length; i++) {
        // check if the mdoule of this toggle
        // was loaded on the API
        let requireModule = togglesMeta[listOfToggles[i]].requireModule;

        const checked = props.menuState.includes(listOfToggles[i])
            ? true
            : false;

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
                    {listOfToggles[i] === "ABM" && (
                        <Collapse in={checked} style={{ width: "100%" }}>
                            <RangeSlider />
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
                            <AccessSubmenu />
                        </Collapse>
                    )}
                </div>
            );
            togglesCompsArray.push(thisToggle);
        }
    }

    return (
        <Drawer
            BackdropProps={{
                classes: {
                    root: classes.backDrop
                }
            }}
            anchor="left"
            open={open}
            onClose={toggleDrawer}
        >
            <div
                className={classes.list}
                role="presentation"
                onClick={toggleDrawer}
                onKeyDown={toggleDrawer}
            ></div>
            <List className={classes.root}>
                <h2>cityscopeJS</h2>
                {togglesCompsArray}
            </List>
        </Drawer>
    );
}

const mapStateToProps = state => {
    return {
        menuState: state.MENU,
        cityIOdata: state.CITYIO
    };
};

export default connect(mapStateToProps, null)(TogglesMenu);
