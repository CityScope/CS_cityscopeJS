import React from "react";
import { useSelector } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import settings from "../../../../settings/settings.json";
import Collapse from "@material-ui/core/Collapse";
import ABMSubmenu from "./ABMSubmenu";
import ShadowSubmenu from "./ShadowSubmenu";
import AccessSubmenu from "./AccessSubmenu";
import Switch from "@material-ui/core/Switch";

function TogglesMenu(props) {
    const { handleToggle } = props;

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
                        <Switch
                            edge="start"
                            onChange={handleToggle(listOfToggles[i])}
                            checked={checked}
                        />
                        <ListItemText
                            primary={togglesMeta[listOfToggles[i]].displayName}
                        />
                    </ListItem>

                    {
                        // ! Handle submenus of ABM/ACCESS

                        listOfToggles[i] === "SHADOWS" && (
                            <Collapse in={checked}>
                                <ShadowSubmenu />
                            </Collapse>
                        )
                    }

                    {
                        // ! Handle submenus of ABM/ACCESS

                        listOfToggles[i] === "ABM" && (
                            <Collapse in={checked}>
                                <ABMSubmenu tripsData={cityioData.ABM2.attr} />
                            </Collapse>
                        )
                    }
                    {listOfToggles[i] === "ACCESS" && (
                        <Collapse
                            in={checked}
                            style={{
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

    return <List>{togglesCompsArray}</List>;
}

export default TogglesMenu;
