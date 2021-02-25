import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import GitHubIcon from "@material-ui/icons/GitHub";
import {
    Box,
    Drawer,
    Fab,
    List,
    Typography,
    makeStyles,
    Card,
    CardContent,
} from "@material-ui/core";
import {
    BarChart as BarChartIcon,
    Map as MapIcon,
    Home as HomeIcon,
} from "react-feather";
import NavItem from "./NavItem";

const items = [
    {
        href: "/home",
        icon: HomeIcon,
        title: "Home",
    },

    {
        href: "/",
        icon: MapIcon,
        title: "CityScopeJS",
    },
    {
        href: "/editor",
        icon: BarChartIcon,
        title: "Grid Editor",
    },
];

const useStyles = makeStyles(() => ({
    mobileDrawer: {
        width: "30vw",
        top: 48,
        height: "calc(100% - 48px)",
        boxShadow:
            "22px 22px 22px 0 rgba(0,0,0)",
    },
}));

const NavBar = ({ onMobileClose, openMobile }) => {
    const classes = useStyles();
    const location = useLocation();

    useEffect(() => {
        if (openMobile && onMobileClose) {
            onMobileClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    const content = (
        <Box height="100%" display="flex" flexDirection="column" p={3}>
            <List>
                {items.map((item) => (
                    <NavItem
                        style={{ padding: "2vh" }}
                        href={item.href}
                        key={item.title}
                        title={item.title}
                        icon={item.icon}
                    />
                ))}
            </List>

            <Box flexGrow={1} />
            <Card elevation={5} p={2}>
                <CardContent position={"bottom"}>
                    <Fab
                        href="http://github.com/CityScope/CS_cityscopeJS/"
                        color="default"
                        size="small"
                    >
                        <GitHubIcon />
                    </Fab>
                    <Box p={2} />
                    <Typography align="left" variant="h5">
                        MIT CityScope
                    </Typography>
                    <Typography align="left" variant="caption">
                        {new Date().getFullYear()}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );

    return (
        <>
            <Drawer
                anchor="left"
                classes={{ paper: classes.mobileDrawer }}
                onClose={onMobileClose}
                open={openMobile}
                elevation={10}
                variant="persistent"
            >
                {content}
            </Drawer>
        </>
    );
};

NavBar.propTypes = {
    onMobileClose: PropTypes.func,
    openMobile: PropTypes.bool,
};

NavBar.defaultProps = {
    onMobileClose: () => {},
    openMobile: false,
};

export default NavBar;
