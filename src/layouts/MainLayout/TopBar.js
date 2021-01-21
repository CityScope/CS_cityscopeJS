import React from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";

import {
    AppBar,
    IconButton,
    Toolbar,
    Typography,
    makeStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles(() => ({
    root: {},
}));

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
    const classes = useStyles();

    return (
        <AppBar
            className={clsx(classes.root, className)}
            elevation={5}
            {...rest}
        >
            <Toolbar variant="dense">
                <IconButton color="inherit" onClick={onMobileNavOpen}>
                    <MenuIcon />
                </IconButton>
                <RouterLink to="/">
                    <Typography
                        className={classes.name}
                        color="textPrimary"
                        variant="h5"
                    >
                        MIT CityScope
                    </Typography>
                </RouterLink>
            </Toolbar>
        </AppBar>
    );
};

TopBar.propTypes = {
    className: PropTypes.string,
    onMobileNavOpen: PropTypes.func,
};

export default TopBar;
