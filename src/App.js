import Provider from "./Provider";
import "./index.css";
import configureStore from "./redux/store";
import Screen from "./components/Screen";
import { StylesProvider } from "@material-ui/core/styles";
import React, { Component } from "react";

const store = configureStore();

const MapRoute = () => {
    let url = window.location.toString();
    let pre = "cityscope=";
    let cityscopePrjName = url.substring(url.indexOf(pre) + pre.length);

    let table = null;
    if (url.indexOf(pre) !== -1 && cityscopePrjName.length > 0) {
        table = cityscopePrjName;
    } else {
        table = "grasbrook";
    }
    console.log("loading CityScope project: " + table);

    return (
        <Provider store={store}>
            <StylesProvider injectFirst>
                <Screen tableName={table} />
            </StylesProvider>
        </Provider>
    );
};

class App extends Component {
    render() {
        return <MapRoute />;
    }
}

export default App;
