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

    if (url.indexOf(pre) !== -1 && cityscopePrjName.length > 0) {
        console.log("loading CityScope project: " + cityscopePrjName);

        return (
            <Provider store={store}>
                <StylesProvider injectFirst>
                    <Screen tableName={cityscopePrjName} />
                </StylesProvider>
            </Provider>
        );
    } else {
        return <h1>CityScopeJS</h1>;
    }
};

class App extends Component {
    render() {
        return <MapRoute />;
    }
}

export default App;
