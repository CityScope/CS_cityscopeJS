import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import NavBar from "./NavBar";
import TopBar from "./TopBar";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background,
        display: "flex",
        height: "100%",
        overflow: "hidden",
        width: "100%",
    },
    wrapper: {
        display: "flex",
        flex: "1 1 auto",
        overflow: "hidden",
        paddingTop: 48,
        [theme.breakpoints.up("lg")]: {
            paddingLeft: 256,
        },
    },
    contentContainer: {
        display: "flex",
        flex: "1 1 auto",
        overflow: "hidden",
    },
    content: {
        flex: "1 1 auto",
        height: "100%",
        overflow: "auto",
    },
}));

const MainLayout = () => {
    const classes = useStyles();
    const [isMobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <div className={classes.root}>
            <NavBar
                onMobileClose={() => setMobileNavOpen(false)}
                openMobile={isMobileNavOpen}
            />
            <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />

            <div className={classes.wrapper}>
                <div className={classes.contentContainer}>
                    <div className={classes.content}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
