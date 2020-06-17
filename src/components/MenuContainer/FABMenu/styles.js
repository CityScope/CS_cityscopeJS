import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        paddingLeft: 16,
        paddingTop: 8,
        zIndex: 1,
    },
    menuButton: {
        marginTop: 8,
        marginBottom: 8,
    },
    editButton: {
        marginTop: 8,
        marginBottom: 8,
    },
    resetViewButton: {
        marginTop: 8,
        marginBottom: 8,
    },
});
