import React from "react";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import { connect } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Radar from "./Radar/Radar";
import BarChart from "./BarChart/BarChart";
import AreaCalc from "./AreaCalc/AreaCalc";

import Paper from "@material-ui/core/Paper";

function VisContainer(props) {
    const drawerWidth = 450;

    const useStyles = makeStyles((theme) => ({
        paper: {
            display: "flex",
            "& > *": {
                margin: theme.spacing(1),
            },
        },
        drawerPaper: {
            width: drawerWidth,
        },
    }));

    const classes = useStyles();
    const showRadar = props.menu && props.menu.includes("RADAR");

    return (
        <React.Fragment>
            {showRadar && (
                <Drawer
                    variant="persistent"
                    anchor="right"
                    open={true}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <List className={classes.list}>
                        <ListItem>
                            <Typography variant="h6" gutterBottom>
                                Urban Indicators
                            </Typography>
                        </ListItem>

                        <div className={classes.paper}>
                            <Paper elevation={10}>
                                <ListItem>
                                    <AreaCalc
                                        cityioData={props.cityioData}
                                        drawerWidth={drawerWidth}
                                    />
                                </ListItem>
                            </Paper>
                        </div>

                        <div className={classes.paper}>
                            <Paper elevation={10}>
                                <ListItem>
                                    <Radar
                                        cityioData={props.cityioData}
                                        drawerWidth={drawerWidth}
                                    />
                                </ListItem>
                            </Paper>
                        </div>

                        <div className={classes.paper}>
                            <Paper elevation={10}>
                                <ListItem>
                                    <BarChart
                                        cityioData={props.cityioData}
                                        drawerWidth={drawerWidth}
                                    />
                                </ListItem>
                            </Paper>
                        </div>
                      
                    </List>
                </Drawer>
            )}
        </React.Fragment>
    );
}

// export default EditMenuMain;

const mapStateToProps = (state) => {
    return {
        cityioData: state.CITYIO,
        menu: state.MENU,
    };
};

export default connect(mapStateToProps, null)(VisContainer);
