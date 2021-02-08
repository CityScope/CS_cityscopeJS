import React from "react";
import SaveAsScenario from "./components/SaveAsScenario";
import ScenarioItems from "./components/ScenarioItems";
import { List, ListItem, Divider } from "@material-ui/core";

export default function SaveMenu(props) {
    const { tableName } = props;

    return (
        <List>
            <ListItem>
                <SaveAsScenario tableName={tableName} />
            </ListItem>
            <ListItem>
                <Divider />
            </ListItem>
            <ListItem>
                <ScenarioItems />
            </ListItem>
        </List>
    );
}
