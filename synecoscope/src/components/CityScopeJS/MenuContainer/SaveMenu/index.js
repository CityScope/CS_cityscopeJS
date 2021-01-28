import React from "react";
import { useStyles } from "./styles";
import SaveAsScenario from "./components/SaveAsScenario";
import ScenarioItems from "./components/ScenarioItems";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";

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
                <ListItem>
                    <Typography variant="h5" gutterBottom>
                        Scenarios
                    </Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="caption" gutterBottom>
                        Use this menu to save, load or delete design scenarios.
                    </Typography>
                </ListItem>
                <ListItem>
                    <SaveAsScenario
                        tableName={tableName}
                        toggleDrawer={toggleDrawer}
                    />
                </ListItem>
                <ScenarioItems toggleDrawer={toggleDrawer} />
            </List>
        </Drawer>
    );
}
