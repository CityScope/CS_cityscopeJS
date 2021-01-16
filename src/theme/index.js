import { createMuiTheme, colors } from "@material-ui/core";
import typography from "./typography";

const theme = createMuiTheme({
    zIndex: {
        appBar: 1500,
    },
    palette: {
        background: {
            default: colors.blueGrey[900],
            paper: colors.blueGrey[900],
            dark: colors.blueGrey[300],
        },
        primary: {
            main: colors.blueGrey[900],
        },
        secondary: {
            main: colors.blueGrey[100],
        },
        text: {
            primary: colors.blueGrey[100],
            secondary: colors.blueGrey[300],
        },
    },
    /*rermoved override shadow props*/
    // shadows,
    typography,

    shape: {
        borderRadius: 16,
    },
    // overrides: {
    //     MuiAppBar: {
    //         colorPrimary: {
    //             backgroundColor: "black",
    //         },
    //     },
    // },
});

export default theme;
