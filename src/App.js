import { Provider } from "react-redux";
import "./index.css";
import configureStore from "./redux/store";
import CityIO from "./services/cityIO";
import DocsMinsite from "./components/docsMinsite/DocsMinsite";
import MenuContainer from "./components/menu/menuContainer";
import MapContainer from "./components/baseMap/baseMapContainer";
import VisContainer from "./components/vis/visContainer";
import React, { Component } from "react";

const store = configureStore();

const MapRoute = () => {
    let url = window.location.toString();
    let pre = "cityscope=";
    let cityscopePrjName = url.substring(url.indexOf(pre) + pre.length);

    if (url.indexOf(pre) !== -1 && cityscopePrjName.length > 0) {
        console.log(url, pre, cityscopePrjName);

        return (
            <Provider store={store}>
                <MapContainer />
                <CityIO tableName={cityscopePrjName} />
                <VisContainer />
                <MenuContainer />
            </Provider>
        );
    }
    return <DocsMinsite />;
};

class App extends Component {
    render() {
        return <MapRoute />;
    }
}

export default App;
