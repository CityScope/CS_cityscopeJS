import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { connect } from "react-redux";
import { listenToSlidersEvents } from "../../../redux/actions";

const marks = [
    {
        value: 0,
        label: "12AM"
    },
    {
        value: 21600,
        label: "6AM"
    },
    {
        value: 43200,
        label: "12PM"
    },
    {
        value: 64800,
        label: "6PM"
    }
];

const useStyles = makeStyles({
    root: {
        width: "100%"
    }
});

function RangeSlider(props) {
    const classes = useStyles();

    const handleSetTimeValue = (e, newValue) => {
        props.listenToSlidersEvents({
            ...props.sliders,
            time: newValue
        });
    };

    const handleSetSpeedValue = (e, newValue) => {
        props.listenToSlidersEvents({
            ...props.sliders,
            speed: newValue
        });
    };

    return (
        <div className={classes.root}>
            <Typography id="range-slider" gutterBottom>
                Simulation Range
            </Typography>
            <Slider
                min={0}
                max={86400}
                marks={marks}
                value={props.sliders.time}
                onChange={handleSetTimeValue}
                valueLabelDisplay="off"
                aria-labelledby="range-slider"
            />
            <Typography id="continuous-slider" gutterBottom>
                Simulation Speed
            </Typography>
            <Slider
                min={0}
                max={100}
                value={props.sliders.speed}
                onChange={handleSetSpeedValue}
                valueLabelDisplay="auto"
                aria-labelledby="continuous-slider"
            />
        </div>
    );
}

const mapStateToProps = state => {
    return {
        sliders: state.SLIDERS
    };
};

const mapDispatchToProps = {
    listenToSlidersEvents: listenToSlidersEvents
};

export default connect(mapStateToProps, mapDispatchToProps)(RangeSlider);
