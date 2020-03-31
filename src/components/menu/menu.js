import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import MenuIcon from "@material-ui/icons/Menu";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import { connect } from "react-redux";
import { listenToMenuUI } from "../../redux/actions";
import settings from "../../settings/settings.json";
import ABMSubmenu from "./ABMSubmenu/ABMSubmenu";
import TypeMenuContainer from "./TypeMenuComponents/TypeMenuContainer";
import NearMeIcon from "@material-ui/icons/NearMe";
import NavigationIcon from "@material-ui/icons/Navigation";
import TogglesMenu from "./TogglesMenu";

// import CircularProgress from "@material-ui/core/CircularProgress";

function Menu(props) {
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

    return (
        <>
            <div className={classes.root}>
                <TogglesMenu
                    classes={classes}
                    open={state.left}
                    toggleDrawer={toggleDrawer}
                    handleToggle={handleToggle}
                />
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
            {state.checked && (
                <>
                    {state.checked.includes("EDIT") && (
                        <TypeMenuContainer key={"EDIT"} />
                    )}
                </>
            )}
        </>
    );
}

const mapStateToProps = state => {
    return {
        menuState: state.MENU,
        cityIOdata: state.CITYIO
    };
};

const mapDispatchToProps = {
    listenToMenuUI: listenToMenuUI
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
