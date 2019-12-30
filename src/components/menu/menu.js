import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";
import Drawer from "@material-ui/core/Drawer";
import Fab from "@material-ui/core/Fab";
import MenuIcon from "@material-ui/icons/Menu";
import { connect } from "react-redux";
import { listenToMenuUI } from "../../redux/reducer";
import settings from "../../settings/settings.json";

function Menu(props) {
    const listOfToggles = Object.keys(settings.menu.toggles);
    const useStyles = makeStyles(theme => ({
        root: {
            width: "100%",
            maxWidth: "15em",
            position: "absolute",
            "& > *": {
                margin: theme.spacing(1)
            }
        },
        paper: {
            background: "black",
            color: "white"
        },

        list: {
            width: "15em"
        },
        fullList: {
            width: "auto"
        },

        menuButton: {
            position: "absolute",
            top: theme.spacing(2),
            left: theme.spacing(2)
        }
    }));

    const classes = useStyles();
    const [toggleStateArray, setChecked] = React.useState([]);
    const [state, setState] = React.useState({
        left: false
    });

    const toggleDrawer = (side, open) => event => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setState({ ...state, [side]: open });
    };

    const sideList = side => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
        ></div>
    );
    const handleToggle = value => () => {
        const currentIndex = toggleStateArray.indexOf(value);
        const newChecked = [...toggleStateArray];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
        props.listenToMenuUI(newChecked);
    };
    let togglesCompsArray = [];
    for (let i = 0; i < listOfToggles.length; i++) {
        const thisToggle = (
            <ListItem key={listOfToggles[i]}>
                <ListItemText primary={listOfToggles[i]} />
                <ListItemSecondaryAction>
                    <Switch
                        edge="end"
                        onChange={handleToggle(listOfToggles[i])}
                        checked={
                            toggleStateArray.indexOf(listOfToggles[i]) !== -1
                        }
                    />
                </ListItemSecondaryAction>
            </ListItem>
        );
        togglesCompsArray.push(thisToggle);
    }
    return (
        <div>
            <div className={classes.root}>
                <Drawer
                    anchor="left"
                    open={state.left}
                    onClose={toggleDrawer("left", false)}
                >
                    {sideList("left")}
                    <List className={classes.root}>
                        <h2>cityscopeJS</h2>
                        {togglesCompsArray}
                    </List>
                </Drawer>
                <Fab
                    aria-label="add"
                    className={classes.menuButton}
                    onClick={toggleDrawer("left", true)}
                >
                    <MenuIcon />
                </Fab>
            </div>
        </div>
    );
}

const mapDispatchToProps = {
    listenToMenuUI: listenToMenuUI
};

export default connect(null, mapDispatchToProps)(Menu);
