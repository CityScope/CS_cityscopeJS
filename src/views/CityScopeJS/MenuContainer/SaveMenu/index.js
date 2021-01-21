import React from "react";
import SaveAsScenario from "./components/SaveAsScenario";
import ScenarioItems from "./components/ScenarioItems";

export default function SaveMenu(props) {
    const { tableName, toggleDrawer } = props;

    return (
        <>
            <SaveAsScenario tableName={tableName} toggleDrawer={toggleDrawer} />
            <ScenarioItems toggleDrawer={toggleDrawer} />
        </>
    );
}
