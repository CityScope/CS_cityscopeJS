import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(0, 1),

        display: "flex",
        paddingLeft: 16,
        paddingRight: 16,
    },
    list: {
        paddingLeft: 16,
        paddingRight: 16,
        width: 300,
        padding: theme.spacing(0, 1),
    },
}));
