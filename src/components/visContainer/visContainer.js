import React from "react";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import { connect } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Radar from "./Radar/Radar";
import BarChart from "./BarChart/BarChart";
import AreaCalc from "./AreaCalc/AreaCalc";

function VisContainer(props) {
    const useStyles = makeStyles({
        root: {
            display: "flex",
            paddingLeft: 16,
            paddingRight: 16,
        },
        paper: {
            background: "#1D1F21",
            width: 400,
        },
        list: {
            color: "#fFF",
        },
        text: {
            marginLeft: 16,
            marginTop: 12,
            flexGrow: 1,
            fontSize: 20,
            marginBottom: 12,
            fontWeight: "lighter",
        },

        dividerColor: {
            backgroundColor: "#484848",
        },
    });

    const classes = useStyles();
    const showRadar = props.menu && props.menu.includes("RADAR");

    return (
        <React.Fragment>
            {showRadar && (
                <Drawer
                    className={classes.root}
                    variant="persistent"
                    anchor="right"
                    open={true}
                    classes={{
                        paper: classes.paper,
                    }}
                >
                    <List className={classes.list}>
                        <ListItem>
                            <ListItemText className={classes.text}>
                                <h2>Urban Indicators</h2>
                            </ListItemText>
                        </ListItem>
                        <ListItem>
                            <Radar cityioData={props.cityioData} />
                        </ListItem>

                        <ListItem>
                            <BarChart cityioData={props.cityioData} />
                        </ListItem>

                        <Divider
                            variant="middle"
                            classes={{ root: classes.dividerColor }}
                        />
                        <ListItem>
                            <AreaCalc cityioData={props.cityioData} />
                        </ListItem>
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
