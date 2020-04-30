import React from "react";
import { useStyles } from "./styles";
import { useSelector } from "react-redux";
import SaveAsScenario from "./components/SaveAsScenario";
import ScenarioItems from "./components/ScenarioItems";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";

function SavedScenariosMenu(props) {
    const classes = useStyles();

    const { handleToggle } = props;

    const menuState = useSelector(state => state.MENU);

    return (
        <Drawer
            className={classes.root}
            BackdropProps={{
                invisible: true
            }}
            classes={{
                paper: classes.paper
            }}
            anchor="left"
            open={menuState && menuState.includes("SCENARIOS")}
            onClose={() => handleToggle("SCENARIOS")}
        >
            <List className={classes.list}>
                <Typography variant="h5" className={classes.text} gutterBottom>
                    Scenarios
                </Typography>
                <SaveAsScenario />
                <ScenarioItems />
            </List>
        </Drawer>
    );
}

export default SavedScenariosMenu;
