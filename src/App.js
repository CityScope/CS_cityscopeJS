import Provider from "./redux/Provider";
import "./index.css";
import configureStore from "./redux/store";
import Screen from "./components/Screen";
import { ThemeProvider } from "@material-ui/styles";
import React, { Component } from "react";
import { createMuiTheme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const theme = createMuiTheme({
    palette: {
        type: "dark",
    },
});

const store = configureStore();

const MapRoute = () => {
    let url = window.location.toString();
    let pre = "cityscope=";
    let cityscopePrjName = url.substring(url.indexOf(pre) + pre.length);

    if (url.indexOf(pre) !== -1 && cityscopePrjName.length > 0) {
        console.log("loading CityScope project: " + cityscopePrjName);

        return (
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <Screen tableName={cityscopePrjName} />
                </ThemeProvider>
            </Provider>
        );
    } else {
        return (
            <ThemeProvider theme={theme}>
                <Typography gutterBottom>CityScopeJS</Typography>
            </ThemeProvider>
        );
    }
};

class App extends Component {
    render() {
        return <MapRoute />;
    }
}

export default App;
