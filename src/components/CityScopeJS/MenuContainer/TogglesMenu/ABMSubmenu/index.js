import React from "react";
import { useStyles } from "./styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { useSelector, useDispatch } from "react-redux";
import {
    listenToSlidersEvents,
    listenToABMmode,
} from "../../../../../redux/actions";
import ABMLegend from "./ABMLegend";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

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

function ABMSubmenu(props) {
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

    const handleSetSpeedValue = (e, newValue) => {
        dispatch(
            listenToSlidersEvents({
                ...sliders,
                speed: newValue,
            })
        );
    };

    const [tripTypeValue, settripTypeValue] = React.useState("mode");

    const handleABMmodeChange = (event) => {
        dispatch(listenToABMmode(event.target.value));
        settripTypeValue(event.target.value);
    };

    return (
        <div className={classes.root}>
            <FormControl component="fieldset">
                <RadioGroup
                    aria-label="tripType"
                    name="tripType"
                    value={tripTypeValue}
                    onChange={handleABMmodeChange}
                >
                    <FormControlLabel
                        value="mode"
                        control={<Radio />}
                        label="Mode Choice"
                    />
                    <FormControlLabel
                        value="profile"
                        control={<Radio />}
                        label="Profile"
                    />
                </RadioGroup>
            </FormControl>

            <ABMLegend trips={props} tripTypeValue={tripTypeValue} />
            <Typography
                className={classes.subtitle1}
                variant="subtitle2"
                id="range-slider"
                gutterBottom
            >
                Simulation Range
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
            <Typography
                className={classes.subtitle2}
                variant="subtitle2"
                id="continuous-slider"
                gutterBottom
            >
                Simulation Speed
            </Typography>
            <Slider
                min={0}
                max={100}
                value={sliders.speed}
                onChange={handleSetSpeedValue}
                valueLabelDisplay="auto"
                aria-labelledby="continuous-slider"
            />
        </div>
    );
}

export default ABMSubmenu;
