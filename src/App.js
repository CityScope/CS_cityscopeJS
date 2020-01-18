import { Provider } from "react-redux";
import "./index.css";
import configureStore from "./redux/store";
import CityIO from "./services/cityIO/cityIO";
import MenuContainer from "./components/menu/menuContainer";
import MapContainer from "./components/baseMap/baseMapContainer";
import VisContainer from "./components/vis/visContainer";
import React, { Component } from "react";

const store = configureStore();

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <MapContainer />
                <CityIO />
                <VisContainer />
                <MenuContainer />
            </Provider>
        );
    }
}

export default App;
