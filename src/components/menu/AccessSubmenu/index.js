import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Switch from "@material-ui/core/Switch";
import { connect } from "react-redux";
import { listenToAccessToggle } from "../../../redux/actions";

const ACCESS_PROPERTIES = [
    "housing",
    "parks",
    "nightlife",
    "employment",
    "groceries",
    "restaurants",
    "education"
];

function AccessSubmenu(props) {
    const { accessToggle, listenToAccessToggle } = props;

    const propList = () => (
        <>
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
                                listenToAccessToggle(i);
                            }}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </>
    );

    return <List>{propList()}</List>;
}

const mapStateToProps = state => {
    return {
        menuState: state.MENU,
        cityIOdata: state.CITYIO,
        accessToggle: state.ACCESS_TOGGLE
    };
};

const mapDispatchToProps = {
    listenToAccessToggle: listenToAccessToggle
};

export default connect(mapStateToProps, mapDispatchToProps)(AccessSubmenu);
