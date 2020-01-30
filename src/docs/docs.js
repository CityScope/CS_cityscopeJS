import React from "react";
import "./styles.css";
import Dashboard from "./Dashboard";
import Provider from "./provider";

function Docs() {
    return (
        <Provider>
            <Dashboard />
        </Provider>
    );
}

export default Docs;
