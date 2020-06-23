import Provider from "../../redux/Provider";
import "./Router.css";
import configureStore from "../../redux/store";
import CityScopeJS from "../CityScopeJS/CityScopeJS";
import { ThemeProvider } from "@material-ui/styles";
import React, { Component } from "react";
import { createMuiTheme } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import SplashScreen from "../SplashScreen/SplashScreen";
import GridEditor from "../GridEditor/GridEditor";

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
                    <CityScopeJS tableName={cityscopePrjName} />
                </Provider>
            </ThemeProvider>
        );
    } else {
        return (
            <Provider store={configureStore()}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <SplashScreen />
                    <GridEditor />
                </ThemeProvider>
            </Provider>
        );
    }
};

export default class Router extends Component {
    render() {
        return <AppRouter />;
    }
}
