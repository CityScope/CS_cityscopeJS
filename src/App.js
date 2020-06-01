import Provider from "./Provider";
import "./index.css";
import configureStore from "./redux/store";
import Screen from "./components/Screen";
import { StylesProvider } from "@material-ui/core/styles";
import React, { Component } from "react";

// redux store configuration
const store = configureStore();

const MapRoute = () => {
    let urlArray = window.location.href.split("/");
    let projectName = urlArray[urlArray.length - 1];
    let table = null;
    if (projectName) {
        table = projectName;
    } else {
        table = "grasbrook";
    }

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
