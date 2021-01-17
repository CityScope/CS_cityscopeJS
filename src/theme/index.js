import { createMuiTheme, colors } from "@material-ui/core";
import typography from "./typography";

const theme = createMuiTheme({
    zIndex: {
        appBar: 1500,
    },
    palette: {
        background: {
            default: "#ff5278",
            paper: "#18191a",
            dark: "#ff5278",
        },
        primary: {
            main: "#18191a",
        },
        secondary: {
            main: "#ff5278",
        },
        text: {
            primary: colors.grey[100],
            secondary: "#ff5278",
        },
    },

    typography,
    shape: {
        borderRadius: 20,
    },
});

export default theme;
