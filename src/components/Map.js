import React, { Component } from "react";
import MapGL from "react-map-gl";
import DeckLayers from "./DeckLayers";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";

export class Map extends Component {
    state = {
        viewport: {
            longitude: 9.9937,
            latitude: 53.5511,
            zoom: 13,
            pitch: 45,
            bearing: 0
        },
        componentDidMount: false
    };

    _onViewportChange = viewport => {
        if (this.state.componentDidMount) this.setState({ viewport });
    };

    componentDidMount() {
        this.setState({ componentDidMount: true });
    }

    render() {
        return (
            <div className="Map">
                <MapGL
                    {...this.state.viewport}
                    onViewportChange={this._onViewportChange}
                    width="100%"
                    height="100%"
                    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                    mapStyle={process.env.REACT_APP_MAPBOX_STYLE}
                >
                    <DeckLayers viewport={this.state.viewport} />
                </MapGL>
            </div>
        );
    }
}

export default Map;
