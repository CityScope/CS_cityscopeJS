import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Map from "./components/Map";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<Map />, document.getElementById("root"));

serviceWorker.unregister();
