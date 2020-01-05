import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import settings from "../../settings/settings.json";
import { connect } from "react-redux";
import { listenToSlidersEvents } from "../../redux/actions";

const sixAm = 6 * 3600;
const { startSimHour, endSimHour } = settings.map.layers.ABM;
const sliderStart = new Date((sixAm + startSimHour) * 1000).getHours();
const sliderEnd = new Date((sixAm + endSimHour) * 1000).getHours();

const marks = [
    {
        value: 0,
        label: "12AM"
    },
    {
        value: 6,
        label: "6AM"
    },
    {
        value: 12,
        label: "12PM"
    },
    {
        value: 18,
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
    const [timeValue, setTimeValue] = React.useState([
        sliderStart,
        12,
        sliderEnd
    ]);

    const [speedValue, setSpeedValue] = React.useState([50]);

    const handleSetTimeValue = (e, newValue) => {
        setTimeValue(newValue);
        // ! not working
        props.listenToSlidersEvents({
            ...props,
            SLIDERS: {
                ...props,
                time: newValue
            }
        });
    };

    const handleSetSpeedValue = (e, newValue) => {
        setSpeedValue(newValue);
        // ! not working
        props.listenToSlidersEvents({
            ...props,
            SLIDERS: {
                ...props,
                speed: newValue
            }
        });
    };

    return (
        <div className={classes.root}>
            <Typography id="range-slider" gutterBottom>
                Simulation Range
            </Typography>
            <Slider
                min={0}
                max={23}
                marks={marks}
                value={timeValue}
                onChange={handleSetTimeValue}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
            />
            <Typography id="range-slider" gutterBottom>
                Simulation Speed
            </Typography>
            <Slider
                min={0}
                max={100}
                value={speedValue}
                onChange={handleSetSpeedValue}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
            />
        </div>
    );
}

const mapStateToProps = state => {
    return {
        ABMlayerEvents: state.MAP
    };
};

const mapDispatchToProps = {
    listenToSlidersEvents: listenToSlidersEvents
};

export default connect(mapStateToProps, mapDispatchToProps)(RangeSlider);
