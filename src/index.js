import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import CityScopeJS from "./components/CityScopeJS";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<CityScopeJS />, document.getElementById("root"));

serviceWorker.unregister();
