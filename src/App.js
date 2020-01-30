import { Provider } from "react-redux";
import "./index.css";
import configureStore from "./redux/store";
import CityIO from "./services/cityIO";
import Docs from "./docs/Docs";
import MenuContainer from "./components/menu/menuContainer";
import MapContainer from "./components/baseMap/baseMapContainer";
import VisContainer from "./components/vis/visContainer";
import React, { Component } from "react";

const store = configureStore();

const MapRoute = () => {
    const tableName = window.location.search.substring(1);
    if (tableName !== "") {
        return (
            <Provider store={store}>
                <MapContainer />
                <CityIO tableName={tableName} />
                <VisContainer />
                <MenuContainer />
            </Provider>
        );
    }
    return <Docs />;
};

class App extends Component {
    render() {
        return <MapRoute />;
    }
}

export default App;
