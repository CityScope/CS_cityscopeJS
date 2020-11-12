// // export default EditMenuMain;

import React from "react";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import TypesEditor from "./TypesEditor/TypesEditor";
import GridProps from "./GridProps/GridProps";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";

export default function EditorMenu() {
    const useStyles = makeStyles((theme) => ({
        drawer: {
            width: "50%",
        },
    }));

    const classes = useStyles();

    return (
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="right"
            open={true}
            classes={{
                paper: classes.drawer,
            }}
        >
            <List>
                <ListItem>
                    <Typography variant="h5">CityScope Grid Editor</Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="caption">
                        Tool for creating CityScope endpoints with virtual
                        editable girds, types, and props, and deploy them to
                        cityIO.
                    </Typography>
                </ListItem>
                <ListItem>
                    <GridProps />
                </ListItem>
                <ListItem>
                    <TypesEditor />
                </ListItem>
            </List>
        </Drawer>
    );
}
