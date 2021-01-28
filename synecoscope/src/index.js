import React from "react";
import ReactDOM from "react-dom";
import Router from "./components/Router/Router";

const root = document.getElementById("root");
const render = () => {
    return ReactDOM.render(<Router />, root);
};

render(Router);

if (module.hot) {
    module.hot.accept(Router, () => {
        const hotModule = require("./components/Router/Router").default;
        render(hotModule);
    });
}
