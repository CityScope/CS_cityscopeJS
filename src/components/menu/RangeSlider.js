import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import settings from "../../settings/settings.json";
import { connect } from "react-redux";

const sixAm = 6 * 3600;
const { startSimHour, animationSpeed, endSimHour } = settings.map.layers.ABM;
const sliderStart = new Date((sixAm + startSimHour) * 1000).getHours();
const sliderEnd = new Date((sixAm + endSimHour) * 1000).getHours();

const marks = [
    {
        value: 0,
        label: "12AM"
    },
    {
        value: 12,
        label: "12PM"
    }
];

const useStyles = makeStyles({
    root: {
        width: "100%"
    }
});

function RangeSlider(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState([sliderStart, 12, sliderEnd]);
    const handleChange = (event, newValue) => {
        setValue(newValue);
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
                value={value}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
            />
        </div>
    );
}

const mapStateToProps = state => {
    return {
        mapEvents: state.MAP
    };
};

export default connect(mapStateToProps, null)(RangeSlider);
