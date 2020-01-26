import { Provider } from "react-redux";
import "./index.css";
import configureStore from "./redux/store";
import CityIO from "./services/cityIO";
import Docs from "./docs/docs";
import MenuContainer from "./components/menu/menuContainer";
import MapContainer from "./components/baseMap/baseMapContainer";
import VisContainer from "./components/vis/visContainer";
import React, { Component } from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const store = configureStore();

const MapRoute = () => {
    const tableName = window.location.search.substring(1);
    if (tableName !== "") {
        return (
            <React.Fragment>
                <MapContainer />
                <CityIO tableName={tableName} />
                <VisContainer />
                <MenuContainer />
            </React.Fragment>
        );
    }
    return <Docs />;
};

const DocsRoute = () => {
    return <Docs />;
};

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Switch>
                        <Route path="/docs">
                            <DocsRoute />;
                        </Route>
                        <Route path="/">
                            <MapRoute />
                        </Route>
                    </Switch>
                </Router>
            </Provider>
        );
    }
}

export default App;
