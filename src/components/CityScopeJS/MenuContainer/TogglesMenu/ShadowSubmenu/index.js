import React from "react";
import { useStyles } from "./styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { useSelector, useDispatch } from "react-redux";
import { listenToSlidersEvents } from "../../../../../redux/actions";

function ShadowSubmenu() {
    const classes = useStyles();

    const sliders = useSelector((state) => state.SLIDERS);

    const dispatch = useDispatch();

    const handleSetTimeValue = (e, newValue) => {
        dispatch(
            listenToSlidersEvents({
                ...sliders,
                time: newValue,
            })
        );
    };

    const marks = [
        {
            value: 0,
            label: "12AM",
        },
        {
            value: 21600,
            label: "6AM",
        },
        {
            value: 43200,
            label: "12PM",
        },
        {
            value: 64800,
            label: "6PM",
        },
        {
            value: 86400,
            label: "12AM",
        },
    ];

    return (
        <div className={classes.root}>
            <Typography
                className={classes.subtitle1}
                variant="subtitle2"
                id="range-slider"
                gutterBottom
            >
                Time of day
            </Typography>
            <Slider
                min={0}
                max={86400}
                marks={marks}
                value={sliders.time}
                onChange={handleSetTimeValue}
                valueLabelDisplay="off"
                aria-labelledby="range-slider"
            />
        </div>
    );
}

export default ShadowSubmenu;
