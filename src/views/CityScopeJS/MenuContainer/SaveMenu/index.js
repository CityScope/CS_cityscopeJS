import React from "react";
import SaveAsScenario from "./components/SaveAsScenario";
import ScenarioItems from "./components/ScenarioItems";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

export default function SaveMenu(props) {
    const { tableName, toggleDrawer } = props;

    return (
        <List>
            <ListItem>
                <SaveAsScenario
                    tableName={tableName}
                    toggleDrawer={toggleDrawer}
                />
            </ListItem>
            <ScenarioItems toggleDrawer={toggleDrawer} />
        </List>
    );
}
