import React, { Component } from "react";
import BaseMap from "./BaseMap";
import { connect } from "react-redux";

import Typography from "@material-ui/core/Typography";
import { Grid, Card, CardContent } from "@material-ui/core";

class MapContainer extends Component {
    _checkKeystone = () => {
        return this.props.menu.includes("KEYSTONE") ? true : false;
    };

    render() {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12} l={4} md={4} xl={4} container>
                    <Grid item container direction="column" spacing={2}>
                        <Grid item xs={12} l={12} md={12} xl={12}>
                            <Card elevation={15}>
                                <CardContent>
                                    <Typography
                                        color="textPrimary"
                                        variant="h1"
                                    >
                                        Menu
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} l={8} md={8} xl={8} container>
                    <BaseMap
                        menu={this.props.menu}
                        selectedType={this.props.selectedType}
                    />
                </Grid>
                <Grid item xs={12} l={4} md={4} xl={4}>
                    <Typography color="textPrimary" variant="h2">
                        Interventions
                    </Typography>
                </Grid>
                <Grid item xs={12} l={4} md={4} xl={4}>
                    <Typography color="textPrimary" variant="h2">
                        Interventions
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        menu: state.MENU,
        selectedType: state.SELECTED_TYPE,
    };
};

export default connect(mapStateToProps, null)(MapContainer);
