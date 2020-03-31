import React from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";
import settings from "../../../settings/settings.json";

import { connect } from "react-redux";
import { listenToMenuUI } from "../../../redux/actions";

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
    const loadedModlues = Object.keys(props.cityIOdata);
    // create each toggle
    for (let i = 0; i < listOfToggles.length; i++) {
        // check if the mdoule of this toggle
        // was loaded on the API
        let requireModule = togglesMeta[listOfToggles[i]].requireModule;

        if (loadedModlues.includes(requireModule) || requireModule === false) {
            const thisToggle = (
                <ListItem key={listOfToggles[i]}>
                    <ListItemText
                        primary={togglesMeta[listOfToggles[i]].displayName}
                    />
                    <ListItemSecondaryAction>
                        <Switch
                            edge="end"
                            onChange={handleToggle(listOfToggles[i])}
                            checked={
                                props.menuState.includes(listOfToggles[i])
                                    ? true
                                    : false
                            }
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            );
            togglesCompsArray.push(thisToggle);
        }
    }

    const sideList = side => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
        ></div>
    );

    return (
        <Drawer
            BackdropProps={{
                classes: {
                    root: classes.backDrop
                }
            }}
            anchor="left"
            open={open}
            onClose={toggleDrawer("left", false)}
        >
            {sideList("left")}
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

const mapDispatchToProps = {
    listenToMenuUI: listenToMenuUI
};

export default connect(mapStateToProps, mapDispatchToProps)(TogglesMenu);
