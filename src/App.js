import Provider from "./redux/Provider";
import "./index.css";
import configureStore from "./redux/store";
import Screen from "./components/Screen";
import { ThemeProvider } from "@material-ui/styles";
import React, { Component } from "react";
import { createMuiTheme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";

const theme = createMuiTheme({
    // ! https://material-ui.com/customization/palette/
    palette: {
        type: "dark",
        background: { default: "#000", paper: "#29323c" },
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
            <ThemeProvider theme={theme}>
                <CssBaseline />

                <Provider store={store}>
                    <Screen tableName={cityscopePrjName} />
                </Provider>
            </ThemeProvider>
        );
    } else {
        return <Typography gutterBottom>CityScopeJS</Typography>;
    }
};

class App extends Component {
    render() {
        return <MapRoute />;
    }
}

export default App;
