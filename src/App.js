import React from "react";
import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import GlobalStyles from "./theme/GlobalStyles";
import theme from "./theme";
import routes from "./routes";

const App = () => {
    const routing = useRoutes(routes);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            {routing}
        </ThemeProvider>
    );
};

export default App;
