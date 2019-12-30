import React, { Component } from "react";
import "./MapStats.css";

class MapStats extends Component {
    render() {
        return (
            <div className="blur mapStats">
                <h2>Info</h2>
                <p>{this.props.stats}</p>
            </div>
        );
    }
}

export default MapStats;
