import React from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
    AppBar,
    Box,
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
                <RouterLink to="/">
                    <Typography
                        className={classes.name}
                        color="textPrimary"
                        variant="h2"
                    >
                        MIT CityScope
                    </Typography>
                </RouterLink>
                <Box flexGrow={1} />

  
                    <IconButton onClick={onMobileNavOpen}>
                        <MenuIcon color='secondary' />
                    </IconButton>
   
            </Toolbar>
        </AppBar>
    );
};

TopBar.propTypes = {
    className: PropTypes.string,
    onMobileNavOpen: PropTypes.func,
};

export default TopBar;
