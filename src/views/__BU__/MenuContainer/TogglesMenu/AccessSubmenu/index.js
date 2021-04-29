import React from "react";
import { useSelector, useDispatch } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { listenToAccessToggle } from "../../../../../redux/actions";
import Switch from "@material-ui/core/Switch";
import { ContinuousColorLegend } from "react-vis";

import settings from "../../../../../settings/settings.json";

function AccessSubmenu(props) {
    const accessToggle = useSelector((state) => state.ACCESS_TOGGLE);

    const { cityioData } = props;

    const ACCESS_PROPERTIES =
        cityioData && cityioData.access && cityioData.access.properties
            ? cityioData.access.properties
            : [];

    const dispatch = useDispatch();
    const c = settings.map.layers.heatmap.colors;
    const l = c.length - 1;
    return (
        <List>
            <ListItem>
                <ContinuousColorLegend
                    width={500}
                    startColor={
                        "rgb(" + c[0][0] + "," + c[0][1] + "," + c[0][2] + ")"
                    }
                    endColor={
                        "rgb(" + c[l][0] + "," + c[l][1] + "," + c[l][2] + ")"
                    }
                    startTitle="No Access"
                    endTitle="Full Access"
                />
            </ListItem>
            {ACCESS_PROPERTIES.map((p, i) => (
                <ListItem key={p}>
                    <ListItemText
                        primary={p}
                        style={{ textTransform: "capitalize" }}
                    />
                    <ListItemSecondaryAction>
                        <Switch
                            edge="end"
                            checked={accessToggle === i}
                            onChange={() => {
                                dispatch(listenToAccessToggle(i));
                            }}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    );
}

export default AccessSubmenu;
