import Provider from "../../redux/Provider";
import "./Router.css";
import configureStore from "../../redux/store";
import App from "./App/App";
import { ThemeProvider } from "@material-ui/styles";
import React, { Component } from "react";
import { createMuiTheme } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import SplashScreen from "./SplashScreen/SplashScreen";

const theme = createMuiTheme({
    // ! https://material-ui.com/customization/palette/
    palette: {
        type: "dark",
        background: { default: "#000", paper: "#29323c" },
    },
});

const AppRouter = () => {
    let url = window.location.toString();
    let pre = "cityscope=";
    let cityscopePrjName = url.substring(url.indexOf(pre) + pre.length);

    if (url.indexOf(pre) !== -1 && cityscopePrjName.length > 0) {
        console.log("loading CityScope project: " + cityscopePrjName);
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />

                <Provider store={configureStore()}>
                    <App tableName={cityscopePrjName} />
                </Provider>
            </ThemeProvider>
        );
    } else {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <SplashScreen />
            </ThemeProvider>
        );
    }
};

export default class Router extends Component {
    render() {
        return <AppRouter />;
    }
}
