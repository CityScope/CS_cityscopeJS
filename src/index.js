import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import store from "./redux/store";
import CityIO from "./services/cityIO/cityIO";
import MenuContainer from "./components/menu/menuContainer";
import MapContainer from "./components/map/mapContainer";
import VisContainer from "./components/vis/visContainer";

const rootDiv = document.getElementById("root");

ReactDOM.render(
    <Provider store={store}>
        <CityIO />
        <MapContainer />
        <VisContainer />
        <MenuContainer />
    </Provider>,
    rootDiv
);
