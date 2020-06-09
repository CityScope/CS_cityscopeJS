import { connect } from "react-redux";
import Radar from "./Radar/Radar";
import BarChart from "./BarChart/BarChart";
import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import AreaCalc from "./AreaCalc/AreaCalc";

const mapStateToProps = (state) => {
    return {
        cityioData: state.CITYIO,
        menu: state.MENU,
    };
};

const useStyles = makeStyles((theme) => ({
    title: {
        color: "#FFF",
        flexGrow: 1,
        fontSize: "2em",
        fontWeight: "bolder",
    },
}));

function VisContainer(props) {
    const classes = useStyles();

    if (props.menu.includes("RADAR")) {
        return (
            <div
                style={{
                    position: "fixed",
                    zIndex: 0,
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    overflow: "auto",
                    width: "100vw",
                    height: "100%",
                    background: "rgba(0,0,0,0.3)",
                    backdropFilter: "blur(0.5em)",
                }}
            >
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: "5vh" }}
                >
                    <Grid item xs={3}>
                        <Typography
                            component="h6"
                            variant="h6"
                            color="inherit"
                            noWrap
                            className={classes.title}
                        >
                            Urban Indicators
                        </Typography>
                    </Grid>
                </Grid>

                <Grid
                    container
                    spacing={5}
                    direction="row"
                    alignItems="center"
                    justify="center"
                >
                    <Grid item>
                        <AreaCalc cityioData={props.cityioData} />
                    </Grid>

                    <Grid item>
                        <Radar cityioData={props.cityioData} />
                    </Grid>
                    <Grid item>
                        <BarChart cityioData={props.cityioData} />
                    </Grid>
                </Grid>
            </div>
        );
    } else {
        return null;
    }
}
export default connect(mapStateToProps, null)(VisContainer);
