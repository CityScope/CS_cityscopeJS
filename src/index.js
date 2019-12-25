import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import store from "./redux/store";

import CityIO from "./services/cityIO";

const rootDiv = document.getElementById("root");

ReactDOM.render(
    <Provider store={store}>
        <CityIO />
    </Provider>,
    rootDiv
);
