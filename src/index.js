import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import Menu from "./components/menu/menu";

ReactDOM.render(
    <Menu />,

    document.getElementById("root")
);

serviceWorker.unregister();
