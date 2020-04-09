import Provider from "./Provider";
import "./index.css";
import configureStore from "./redux/store";
import Screen from "./components/Screen";
import DocsMinsite from "./components/docsMinsite/DocsMinsite";
import { StylesProvider } from "@material-ui/core/styles";
import React, { Component } from "react";

const store = configureStore();

const MapRoute = () => {
    let url = window.location.toString();
    let pre = "cityscope=";
    let cityscopePrjName = url.substring(url.indexOf(pre) + pre.length);

    if (url.indexOf(pre) !== -1 && cityscopePrjName.length > 0) {
        return (
            <Provider store={store}>
                <StylesProvider injectFirst>
                    <Screen tableName={cityscopePrjName} />
                </StylesProvider>
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
