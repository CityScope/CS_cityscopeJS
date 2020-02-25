import React from "react";
import settings from "../../../../settings/settings.json";
import List from "@material-ui/core/List";
import { StyledListItem } from "./styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import CommuteIcon from "@material-ui/icons/Commute";
import { connect } from "react-redux";
import { useStyles } from "./styles";

import { listenToTypeEditor } from "../../../../redux/actions";

const buildingTypes = settings.map.types;
const networkTypes = settings.map.netTypes;

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
                <StyledListItem
                    color={rgbCol}
                    key={type}
                    button
                    variant="raised"
                    selected={selectedIndex === typesFamily[type].name}
                    onClick={event =>
                        handleListItemClick(event, typesFamily[type])
                    }
                >
                    <Typography
                        variant="subtitle2"
                        className={classes.typeName}
                        align="center"
                    >
                        {typesFamily[type].name}
                    </Typography>
                </StyledListItem>
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
            <List className={classes.list}>
                {createTypesIcons(buildingTypes)}
            </List>
            <Divider />
            <Typography variant="h6" gutterBottom>
                <CommuteIcon />
                Mobility
            </Typography>
            <List className={classes.list}>
                {createTypesIcons(networkTypes)}
            </List>
        </Paper>
    );
}

const mapDispatchToProps = {
    listenToTypeEditor: listenToTypeEditor
};

export default connect(null, mapDispatchToProps)(TypeEditor);
