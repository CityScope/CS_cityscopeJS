import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import { createMuiTheme } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";
import Drawer from "@material-ui/core/Drawer";
import Fab from "@material-ui/core/Fab";
import MenuIcon from "@material-ui/icons/Menu";
import EditIcon from "@material-ui/icons/Edit";

import { connect } from "react-redux";
import { listenToMenuUI } from "../../redux/actions";
import settings from "../../settings/settings.json";
import PaperSheet from "./PaperSheet";
import { ThemeProvider } from "@material-ui/styles";

// import CircularProgress from "@material-ui/core/CircularProgress";

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
            position: "fixed",
            top: theme.spacing(2),
            left: theme.spacing(2)
        },
        editButton: {
            position: "fixed",
            top: theme.spacing(10),
            left: theme.spacing(2)
        }
    }));

    const classes = useStyles();
    const theme = createMuiTheme({
        palette: {
            type: "dark"
        }
    });
    const [toggleStateArray, setChecked] = React.useState(
        Object.keys(settings.menu.toggles)
            .filter(function(k) {
                return settings.menu.toggles[k];
            })
            .map(String)
    );

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
        setState({ ...state, checked: newChecked });

        props.listenToMenuUI(newChecked);
    };

    let togglesCompsArray = [];
    for (let i = 0; i < listOfToggles.length; i++) {
        const thisToggle = (
            <ListItem key={listOfToggles[i]}>
                {/* <CircularProgress size={20} thickness={5} /> */}

                <ListItemText primary={listOfToggles[i]} />
                <ListItemSecondaryAction>
                    <Switch
                        /**
                         * gets props with initial menu state
                         * and turn on the layer on init
                         */
                        edge="end"
                        onChange={handleToggle(listOfToggles[i])}
                        checked={
                            props.menuState.includes(listOfToggles[i])
                                ? true
                                : false
                        }
                    />
                </ListItemSecondaryAction>
            </ListItem>
        );
        togglesCompsArray.push(thisToggle);
    }

    const renderABMslider = () => {
        if (state.checked && state.checked.includes("ABM")) {
            return <PaperSheet />;
        } else return null;
    };

    return (
        <ThemeProvider theme={theme}>
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
            </div>
            <Fab
                className={classes.menuButton}
                onClick={toggleDrawer("left", true)}
            >
                <MenuIcon />
            </Fab>

            <Fab className={classes.editButton} onClick={handleToggle("EDIT")}>
                <EditIcon />
            </Fab>
            {renderABMslider()}
        </ThemeProvider>
    );
}

const mapStateToProps = state => {
    return {
        menuState: state.MENU
    };
};

const mapDispatchToProps = {
    listenToMenuUI: listenToMenuUI
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
