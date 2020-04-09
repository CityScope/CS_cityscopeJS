import React from "react";
import { useStyles } from "./styles";
import { useSelector, useDispatch } from "react-redux";
import { listenToEditMenu } from "../../../../redux/actions";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Box from "@material-ui/core/Box";

function EditMenuOptions() {
    const selectedType = useSelector(state => state.SELECTED_TYPE);
    const { name, height } = selectedType;

    const dispatch = useDispatch();

    const classes = useStyles();
    const marks = [
        { value: 0, label: "0" },
        { value: 50, label: "50" }
    ];
    const mixedUse = height ? height.constructor === Array : false;
    const sliderText = mixedUse ? "Street Level / Total Floors" : "Height";
    if (name !== "Residential" && name !== "Office Tower") return null;
    return (
        <Paper className={classes.root}>
            <Typography variant="h6" className={classes.name}>
                {name}
            </Typography>
            <Box component="div" className={classes.box}>
                <Typography
                    id="floors"
                    className={classes.item}
                    variant="subtitle1"
                >
                    {sliderText}
                </Typography>
                <Slider
                    classes={{
                        root: classes.slider
                    }}
                    value={height}
                    valueLabelDisplay="auto"
                    onChange={(event, value) =>
                        dispatch(
                            listenToEditMenu({
                                ...selectedType,
                                height: value
                            })
                        )
                    }
                    aria-labelledby="Floors"
                    getAriaLabel={index => index.toString()}
                    min={0}
                    max={50}
                    marks={marks}
                ></Slider>
            </Box>
        </Paper>
    );
}

export default EditMenuOptions;
