import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { errorStyle } from "./services/consoleStyle";

const root = document.getElementById("root");
const render = () => {
    return ReactDOM.render(<App />, root);
};

render(App);

if (module.hot) {
    console.log("%c hot module reload...", errorStyle);

    module.hot.accept("./App", () => {
        const NextApp = require("./App").default;
        render(NextApp);
    });
}
