import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import settings from "../../../settings/settings.json";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import CommuteIcon from "@material-ui/icons/Commute";
import { connect } from "react-redux";

import { listenToTypeEditor } from "../../../redux/actions";

const buildingTypes = settings.map.types;
const networkTypes = settings.map.netTypes;

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2, 5),
        position: "fixed",
        bottom: "3vw",
        right: "3vw",
        maxWidth: "35%",
        maxHeight: "50%",
        overflow: "auto"
    },

    shadow: {
        boxShadow: "inset 0 0 2px #000000"
    }
}));

function TypeEditor(props) {
    const classes = useStyles();
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleListItemClick = (event, typeProps) => {
        setSelectedIndex(typeProps.name);
        props.listenToTypeEditor(typeProps);
    };

    const createTypesIcons = typesFamily => {
        let iconsArr = [];
        Object.keys(typesFamily).forEach(type => {
            let col = typesFamily[type].color;
            let rgbCol = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";

            iconsArr.push(
                <ListItem
                    style={{
                        margin: ".2em",
                        borderRadius: "0.5em",
                        border: "2px solid " + rgbCol
                    }}
                    className={classes.shadow}
                    variant="outlined"
                    key={type}
                    button
                    selected={selectedIndex === typesFamily[type].name}
                    onClick={event =>
                        handleListItemClick(event, typesFamily[type])
                    }
                >
                    <Typography variant="caption">
                        {typesFamily[type].name}
                    </Typography>
                </ListItem>
            );
        });
        return iconsArr;
    };

    return (
        <Paper className={classes.root}>
            <Typography variant="h6" gutterBottom>
                <HomeWorkIcon />
                Buildings
            </Typography>
            <List>{createTypesIcons(buildingTypes, <HomeWorkIcon />)}</List>
            <Divider />
            <Typography variant="h6" gutterBottom>
                <CommuteIcon />
                Mobility
            </Typography>
            <List>{createTypesIcons(networkTypes, <CommuteIcon />)}</List>
        </Paper>
    );
}

const mapDispatchToProps = {
    listenToTypeEditor: listenToTypeEditor
};

export default connect(null, mapDispatchToProps)(TypeEditor);
