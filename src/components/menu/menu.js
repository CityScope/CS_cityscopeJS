import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import MenuIcon from "@material-ui/icons/Menu";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import { connect } from "react-redux";
import { listenToMenuUI } from "../../redux/actions";
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

    const [state, setState] = React.useState({
        drawerOpen: false
    });

    const toggleDrawer = () => {
        setState({ ...state, drawerOpen: !state.drawerOpen });
    };

    const { menuState, listenToMenuUI } = props;

    const handleToggle = value => () => {
        const i = menuState.indexOf(value);
        const updatedMenuState = [...menuState];
        if (i === -1) {
            updatedMenuState.push(value);
        } else {
            updatedMenuState.splice(i, 1);
        }

        listenToMenuUI(updatedMenuState);
    };

    return (
        <>
            <div className={classes.root}>
                <TogglesMenu
                    classes={classes}
                    open={state.drawerOpen}
                    toggleDrawer={toggleDrawer}
                    handleToggle={handleToggle}
                />
            </div>
            <Fab className={classes.menuButton} onClick={toggleDrawer}>
                <MenuIcon />
            </Fab>
            <Fab className={classes.editButton} onClick={handleToggle("EDIT")}>
                {menuState.includes("EDIT") ? <CancelIcon /> : <EditIcon />}
            </Fab>
            <Fab
                className={classes.resetViewButton}
                onClick={handleToggle("RESET_VIEW")}
            >
                {menuState.includes("RESET_VIEW") ? (
                    <NavigationIcon />
                ) : (
                    <NearMeIcon />
                )}
            </Fab>
            {menuState && (
                <>
                    {menuState.includes("EDIT") && (
                        <TypeMenuContainer key={"EDIT"} />
                    )}
                </>
            )}
        </>
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
