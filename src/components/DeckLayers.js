import { GeoJsonLayer } from "@deck.gl/layers";
import DeckGL from "deck.gl";
import React, { Component } from "react";
import CityIO from "./CityIO";

const GEODATA =
    "https://raw.githubusercontent.com/dwillis/nyc-maps/master/state_assembly.geojson";

export default class DeckLayers extends Component {
    render() {
        const { viewport } = this.props;
        let layers = [
            new GeoJsonLayer({
                id: "GEOJSON_GRID",
                data: GEODATA,
                pickable: true,
                stroked: true,
                filled: true,
                extruded: true,
                lineWidthScale: 20,
                lineWidthMinPixels: 2,
                getFillColor: [0, 0, 255, 100],
                getLineColor: [255, 255, 255, 100],
                getRadius: 100,
                getLineWidth: 1,
                getElevation: d => {
                    return d.properties.Shape_Leng / 100;
                }
            })
        ];
        return <DeckGL viewState={viewport} layers={layers}></DeckGL>;
    }
}
