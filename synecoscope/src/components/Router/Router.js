import Provider from "../../redux/Provider";
import "./Router.css";
import store from "../../redux/store";
import CityScopeJS from "../CityScopeJS/CityScopeJS";
import { ThemeProvider } from "@material-ui/styles";
import React, { Component } from "react";
import { createMuiTheme } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import SplashScreen from "../SplashScreen/SplashScreen";
import GridEditor from "../GridEditor/GridEditor";

/**
 *  ! https://material-ui.com/customization/palette/
 */
const theme = createMuiTheme({
    palette: {
        type: "dark",
        background: { default: "#000", paper: "#1f252d" },
    },
});

const AppRouter = () => {
    let url = window.location.toString();
    let pre = "cityscope=";
    let cityscopePrjName = url.substring(url.indexOf(pre) + pre.length);
    let app = null;
    // check URL for proper CS project link
    if (url.indexOf(pre) !== -1 && cityscopePrjName.length > 0) {
        console.log("Loading CityScope project: " + cityscopePrjName);
        app = <CityScopeJS tableName={cityscopePrjName} />;
    } else if (window.location.search === "?editor") {
        app = <GridEditor />;
    } else {
        app = <SplashScreen />;
    }

    return app;
};

export default class Router extends Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Provider store={store}>
                    <AppRouter />
                </Provider>
            </ThemeProvider>
        );
    }
}
