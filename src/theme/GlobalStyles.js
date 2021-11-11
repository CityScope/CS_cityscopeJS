import { createStyles, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() =>
    createStyles({
        "@global": {
            "*": {
                boxSizing: "border-box",
                margin: 0,
                padding: 0,

                //  Style for ScrollBar
                scrollbarColor: "#6b6b6b #18191a",
                "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                  backgroundColor: "#18191a",
                },
                "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                  borderRadius: 8,
                  backgroundColor: "#6b6b6b",
                  minHeight: 24,
                  border: "3px solid #18191a",
                },
                "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
                  backgroundColor: "#959595",
                },
                "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
                  backgroundColor: "#959595",
                },
                "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#959595",
                },
                "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
                  backgroundColor: "#18191a",
                },
            },
            html: {
                "-webkit-font-smoothing": "antialiased",
                "-moz-osx-font-smoothing": "grayscale",
                height: "100%",
                width: "100%",
            },
            body: {
                backgroundColor: "#18191a",
                height: "100%",
                width: "100%",
            },
            a: {
                textDecoration: "none",
            },
            "#root": {
                height: "100%",
                width: "100%",
            },
        },
    })
);

const GlobalStyles = () => {
    useStyles();

    return null;
};

export default GlobalStyles;
