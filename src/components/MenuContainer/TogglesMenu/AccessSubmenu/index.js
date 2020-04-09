import React from "react";
import { useSelector, useDispatch } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { ColoredSwitch } from "../styles";
import { listenToAccessToggle } from "../../../../redux/actions";

function AccessSubmenu() {
    const { accessToggle, cityioData } = useSelector(state => ({
        accessToggle: state.ACCESS_TOGGLE,
        cityioData: state.CITYIO
    }));

    const ACCESS_PROPERTIES =
        cityioData && cityioData.access && cityioData.access.properties
            ? cityioData.access.properties
            : [];

    const dispatch = useDispatch();

    return (
        <List>
            {ACCESS_PROPERTIES.map((p, i) => (
                <ListItem key={p}>
                    <ListItemText
                        primary={p}
                        style={{ textTransform: "capitalize" }}
                    />
                    <ListItemSecondaryAction>
                        <ColoredSwitch
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
