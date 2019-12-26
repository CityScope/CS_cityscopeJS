import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import store from "./redux/store";
import CityIO from "./services/cityIO";
import Radar from "./components/vis/Radar/Radar";
import Menu from "./components/menu/menu";
import Map from "./components/map/map";

const rootDiv = document.getElementById("root");

ReactDOM.render(
    <Provider store={store}>
        <CityIO />
        <Radar />
        <Map />
        <Menu />
    </Provider>,
    rootDiv
);
