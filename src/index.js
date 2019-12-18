import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import CityIO from "./services/cityIO";

ReactDOM.render(<CityIO />, document.getElementById("root"));
serviceWorker.unregister();
