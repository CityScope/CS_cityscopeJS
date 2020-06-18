import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const root = document.getElementById("root");
const render = () => {
    return ReactDOM.render(<App />, root);
};

render(App);

if (module.hot) {
    module.hot.accept("./App", () => {
        const NextApp = require("./App").default;
        render(NextApp);
    });
}
