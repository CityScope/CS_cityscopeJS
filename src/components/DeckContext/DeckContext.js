import React, { Component } from "react";
import DeckGL from "@deck.gl/react";
import { StaticMap } from "react-map-gl";
import MobilityModule from "../Trips/Trips";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoicmVsbm94IiwiYSI6ImNqd2VwOTNtYjExaHkzeXBzYm1xc3E3dzQifQ.X8r8nj4-baZXSsFgctQMsg";
const MAPBOX_STYLE =
  "mapbox://styles/relnox/cjs9rb33k2pix1fo833uweyjd?fresh=true";

const INITIAL_VIEW_STATE = {
  longitude: -74,
  latitude: 40.72,
  zoom: 13,
  pitch: 45,
  bearing: 0
};

export class DeckContext extends Component {
  render() {
    return (
      <DeckGL
        controller={true}
        initialViewState={INITIAL_VIEW_STATE}
        layers={MobilityModule}
      >
        <StaticMap
          reuseMaps
          mapStyle={MAPBOX_STYLE}
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />
      </DeckGL>
    );
  }
}

export default DeckContext;
