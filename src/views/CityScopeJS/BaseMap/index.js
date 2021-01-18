import React, { Component } from "react";
import BaseMap from "./BaseMap";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { Grid, Card, CardContent } from "@material-ui/core";

class MapContainer extends Component {
    render() {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} l={3} md={3} xl={3} container>
                    <Grid item container direction="column" spacing={2}>
                        <Grid item xs={12} l={12} md={12} xl={12}>
                            <Card elevation={15}>
                                <CardContent>
                                    <Typography
                                        color="textPrimary"
                                        variant="h6"
                                    >
                                        Menu
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} l={8} md={8} xl={8} container>
                    <Card elevation={15}>
                        <BaseMap
                            menu={this.props.menu}
                            selectedType={this.props.selectedType}
                        />
                    </Card>
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
