import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import settings from "../../settings/settings.json";
import { connect } from "react-redux";

const { startSimHour, animationSpeed, endSimHour } = settings.map.layers.ABM;
const sliderStart = new Date(startSimHour * 1000).getHours();
const sliderEnd = new Date(endSimHour * 1000).getHours();

const useStyles = makeStyles({
    root: {
        width: 200
    }
});

function RangeSlider(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState([sliderStart, 5, sliderEnd]);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <Typography id="range-slider" gutterBottom>
                Simulation Range
            </Typography>
            <Slider
                min={sliderStart}
                max={sliderEnd}
                value={value}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
            />
        </div>
    );
}

const mapStateToProps = state => {
    console.log(state);

    return {
        mapEvents: state.MAP
    };
};

export default connect(mapStateToProps, null)(RangeSlider);
