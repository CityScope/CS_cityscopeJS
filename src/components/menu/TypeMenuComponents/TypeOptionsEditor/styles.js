import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
    root: {
        display: "flex",
        position: "absolute",
        paddingBottom: "10px",
        paddingTop: "10px",
        paddingLeft: "30px",
        paddingRight: "30px",
        left: "50%",
        bottom: "25%",
        transform: "translate(-50%, 0)",
        flexDirection: "row",
        alignItems: "center",
        width: "50vw",
        overflow: "auto"
    },
    name: {
        display: "flex",
        minWidth: "30%",
        minHeight: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    item: { marginRight: "20px" },
    slider: { marginTop: "23px" },
    box: {
        display: "flex",
        flexDirection: "row",
        minWidth: "70%",
        alignItems: "center"
    }
});
