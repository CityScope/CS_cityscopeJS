import React, { useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import { useSelector } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Radar from "./Radar/Radar";
import BarChart from "./BarChart/BarChart";
import AreaCalc from "./AreaCalc/AreaCalc";
import DataTable from "./DataTable";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

import Paper from "@material-ui/core/Paper";

export default function VisContainer() {
    const drawerWidth = 450;

    const [dataType, setDataType] = useState("indicators");
    const [open, setOpen] = useState(false);

    const [cityioData, menu] = useSelector((state) => [
        state.CITYIO,
        state.MENU,
    ]);

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
        form: {
            width: "40%",
        },
    }));
    const classes = useStyles();

    const showRadar = menu && menu.includes("RADAR");

    return (
        <>
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
                        <ListItem>
                            <FormControl
                                classes={{
                                    root: classes.form,
                                }}
                            >
                                <InputLabel>Data Type</InputLabel>
                                <Select
                                    open={open}
                                    value={dataType}
                                    onOpen={() => {
                                        setOpen(true);
                                    }}
                                    onClose={() => {
                                        setOpen(false);
                                    }}
                                    onChange={(event) =>
                                        setDataType(event.target.value)
                                    }
                                >
                                    {Object.keys(cityioData).map((key, i) => (
                                        <MenuItem key={i} value={key}>
                                            {key}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </ListItem>
                        <ListItem>
                            <DataTable dataType={dataType}></DataTable>
                        </ListItem>

                        <div className={classes.paper}>
                            <Paper elevation={10}>
                                <ListItem>
                                    <Radar
                                        cityioData={cityioData}
                                        drawerWidth={drawerWidth}
                                    />
                                </ListItem>
                            </Paper>
                        </div>

                        <div className={classes.paper}>
                            <Paper elevation={10}>
                                <ListItem>
                                    <BarChart
                                        cityioData={cityioData}
                                        drawerWidth={drawerWidth}
                                    />
                                </ListItem>
                            </Paper>
                        </div>
                        <div className={classes.paper}>
                            <Paper elevation={10}>
                                <ListItem>
                                    <AreaCalc
                                        cityioData={cityioData}
                                        drawerWidth={drawerWidth}
                                    />
                                </ListItem>
                            </Paper>
                        </div>
                    </List>
                </Drawer>
            )}
        </>
    );
}
