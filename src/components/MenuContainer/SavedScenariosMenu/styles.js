import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
    root: {
        display: "flex",
        paddingLeft: 16,
        paddingRight: 16
    },
    paper: {
        background: "#1D1F21"
    },
    list: {
        width: "23vw",
        color: "#FFF"
    },
    text: {
        marginLeft: 16,
        marginTop: 12,
        flexGrow: 1,
        fontSize: 20,
        marginBottom: 12,
        fontWeight: "lighter"
    }
});
