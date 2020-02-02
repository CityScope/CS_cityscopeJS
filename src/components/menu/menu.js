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
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import { connect } from "react-redux";
import { listenToMenuUI } from "../../redux/actions";
import settings from "../../settings/settings.json";
import ABMSubmenu from "./ABMSubmenu/ABMSubmenu";
import TypeEditor from "./TypeEditor/TypeEditor";
import NearMeIcon from "@material-ui/icons/NearMe";
import NavigationIcon from "@material-ui/icons/Navigation";

// import CircularProgress from "@material-ui/core/CircularProgress";

function Menu(props) {
    const togglesMeta = settings.menu.toggles;
    const listOfToggles = Object.keys(togglesMeta);
    const useStyles = makeStyles(theme => ({
        root: {
            width: "100%",
            maxWidth: "30vw",
            position: "absolute",
            "& > *": {
                margin: theme.spacing(1)
            }
        },
        backDrop: {
            backgroundColor: "transparent"
        },
        paper: {
            background: "black",
            color: "white"
        },

        list: {
            width: "30vw"
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
            top: theme.spacing(12),
            left: theme.spacing(2)
        },
        resetViewButton: {
            position: "fixed",
            top: theme.spacing(22),
            left: theme.spacing(2)
        }
    }));

    const classes = useStyles();
    const [toggleStateArray, setChecked] = React.useState(
        Object.keys(settings.menu.toggles)
            .filter(function(k) {
                return settings.menu.toggles[k].showOnInit;
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

    /**
     * gets props with initial menu state
     * and turn on the layer on init
     */
    let togglesCompsArray = [];
    for (let i = 0; i < listOfToggles.length; i++) {
        const thisToggle = (
            <ListItem key={listOfToggles[i]}>
                <ListItemText
                    primary={togglesMeta[listOfToggles[i]].displayName}
                />
                <ListItemSecondaryAction>
                    <Switch
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

    const renderSubMenu = () => {
        if (state.checked) {
            let subMenuArr = [];
            state.checked.forEach(layer => {
                switch (layer) {
                    case "ABM":
                        subMenuArr.push(<ABMSubmenu key={layer} />);
                        break;
                    case "EDIT":
                        subMenuArr.push(<TypeEditor key={layer} />);
                        break;

                    default:
                        break;
                }
            });
            return subMenuArr;
        }
    };

    return (
        <React.Fragment>
            <div className={classes.root}>
                <Drawer
                    BackdropProps={{
                        classes: {
                            root: classes.backDrop
                        }
                    }}
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
                {toggleStateArray.includes("EDIT") ? (
                    <CancelIcon />
                ) : (
                    <EditIcon />
                )}
            </Fab>
            <Fab
                className={classes.resetViewButton}
                onClick={handleToggle("RESET_VIEW")}
            >
                {toggleStateArray.includes("RESET_VIEW") ? (
                    <NavigationIcon />
                ) : (
                    <NearMeIcon />
                )}
            </Fab>
            {/** renders sub menus based on toggle state */}
            {renderSubMenu()}
        </React.Fragment>
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
