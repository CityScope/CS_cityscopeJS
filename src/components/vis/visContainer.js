import { connect } from "react-redux";
import Radar from "./Radar/Radar";
import BarChart from "./BarChart/BarChart";
import React from "react";
import Grid from "@material-ui/core/Grid";

const mapStateToProps = (state) => {
    return {
        cityioData: state.CITYIO,
        menu: state.MENU,
    };
};

function VisContainer(props) {
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
                }}
            >
                <Grid
                    container
                    spacing={0}
                    direction="row"
                    alignItems="center"
                    justify="center"
                    style={{
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.3)",
                        backdropFilter: "blur(0.5em)",
                    }}
                >
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
