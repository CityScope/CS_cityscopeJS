import React from "react";
import { useSelector, useDispatch } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { listenToAccessToggle } from "../../../../redux/actions";
import Switch from "@material-ui/core/Switch";

function AccessSubmenu(props) {
    const accessToggle = useSelector((state) => state.ACCESS_TOGGLE);

    const { cityioData } = props;

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
