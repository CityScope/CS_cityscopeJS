import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Switch from "@material-ui/core/Switch";
import Map from "../map/map";
import EditMenu from "./editMenu";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        maxWidth: "25%",
        position: "absolute",
        backgroundColor: "rgba(255,255,255,0.8)",
        left: theme.spacing(2),
        bottom: theme.spacing(10),
        borderRadius: "5%"
    }
}));

const layersID = ["PATHS", "ABM", "GEOJSON_GRID", "ACCESS", "SUN"];

export default function Menu() {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([]);

    const handleToggle = value => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    let togglesArray = [];

    for (let i = 0; i < layersID.length; i++) {
        const thisToggle = (
            <ListItem key={layersID[i]}>
                <ListItemText primary={layersID[i]} />
                <ListItemSecondaryAction>
                    <Switch
                        edge="end"
                        onChange={handleToggle(layersID[i])}
                        checked={checked.indexOf(layersID[i]) !== -1}
                    />
                </ListItemSecondaryAction>
            </ListItem>
        );
        togglesArray.push(thisToggle);
    }

    return (
        <div>
            <Map menu={checked} />
            <List className={classes.root}>{togglesArray}</List>
            <EditMenu />
        </div>
    );
}
