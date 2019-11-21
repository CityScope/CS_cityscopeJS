import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import DeckContext from "./components/DeckContext/DeckContext";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<DeckContext />, document.getElementById("root"));

serviceWorker.unregister();
