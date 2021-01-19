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
            main: "#FFF",
            light: "colors.grey[500]",
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

    overrides: {
        MuiAppBar: {
            colorPrimary: { backgroundColor: "#18191a", color: "#FFF" },
        },
        MuiCard: {
            root: {
                boxShadow:
                    "12px 12px 16px 0 rgba(0,0,0),-8px -8px 12px 0 rgba(40,41,42)",
            },
        },
        MuiButton: {
            root: {
                boxShadow:
                    "12px 12px 16px 0 rgba(0,0,0),-8px -8px 12px 0 rgba(40,41,42)",
            },
        },
    },
});

export default theme;
