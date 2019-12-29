import React, { Component } from "react";
import "./MapStats.css";

class MapStats extends Component {
    render() {
        return (
            <div className="blur mapStats">
                <h2>simulation time</h2>
                <h4>{this.props.time}</h4>
            </div>
        );
    }
}

export default MapStats;
