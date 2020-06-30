import React from "react";
import { useStyles } from "./styles";
import SaveAsScenario from "./components/SaveAsScenario";
import ScenarioItems from "./components/ScenarioItems";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";

export default function SaveMenu(props) {
    const classes = useStyles();

    const { tableName, open, toggleDrawer } = props;

    return (
        <Drawer
            className={classes.root}
            BackdropProps={{
                invisible: true,
            }}
            classes={{
                paper: classes.paper,
            }}
            anchor="left"
            open={open}
            onClose={toggleDrawer}
        >
            <List className={classes.list}>
                <Typography variant="h5" className={classes.text} gutterBottom>
                    Scenarios
                </Typography>
                <SaveAsScenario tableName={tableName} />
                <ScenarioItems />
            </List>
        </Drawer>
    );
}
