import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import "mapbox-gl/dist/mapbox-gl.css";
import { mapSettings } from "../../../../settings/settings";
import {
  //   AccessLayer,
  //   AggregatedTripsLayer,
  //   ABMLayer,
  GridLayer,
} from "./deckglLayers";

export default function PrjDeckGLMap() {
  const settings = mapSettings;
  const [viewState, setViewState] = useState(settings.map.initialViewState);
  const deckGL = useRef();
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);

  const setViewStateToTableHeader = () => {
    const header = cityIOdata.GEOGRID.properties.header;

    setViewState({
      ...viewState,
      longitude: header.longitude,
      latitude: header.latitude,
      zoom: 15,
      pitch: 0,
      bearing: 360 - header.rotation,
      orthographic: true,
    });
  };

  useEffect(() => {
    // fix deck view rotate
    document
      .getElementById("deckgl-wrapper")
      .addEventListener("contextmenu", (evt) => evt.preventDefault());

    // on init, check if prev. local storage with
    // view state exist. If so, load it.
    if (localStorage.getItem("projectionViewStateStorage")) {
      console.log("loading prev. projectionViewStateStorage...");
      let vs = localStorage.getItem("projectionViewStateStorage");
      setViewState(JSON.parse(vs));
    } else {
      // zoom map on CS table location
      setViewStateToTableHeader();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onViewStateChange = ({ viewState }) => {
    //    save current view state to local sotrage
    localStorage.setItem(
      "projectionViewStateStorage",
      JSON.stringify(viewState)
    );

    setViewState(viewState);
  };

  const layersKey = {
    //   ABM: ABMLayer({
    //     active: viewSettings.ABMLayer.active,
    //     data: ABM.trips,
    //     cityioData: cityIOdata,
    //     ABMmode: viewSettings.ABMLayer.ABMmode,
    //     zoomLevel: viewSettings.ABMLayer.zoomLevel,
    //     time: viewSettings.time,
    //   }),
    //   AGGREGATED_TRIPS: AggregatedTripsLayer({
    //     active: viewSettings.AggregatedTripsLayer.active,
    //     data: ABM.trips,
    //     cityioData: cityIOdata,
    //     ABMmode: viewSettings.AggregatedTripsLayer.ABMmode,
    //   }),
    GRID: GridLayer({
      data: cityIOdata,
    }),
    //   ACCESS: AccessLayer({
    //     active: viewSettings.AccessLayer.active,
    //     data: access,
    //     accessToggle: viewSettings.AccessLayer.accessToggle,
    //   }),
  };

  const layerOrder = ["ABM", "AGGREGATED_TRIPS", "GRID", "ACCESS"];

  const renderLayers = () => {
    let layers = [];
    for (var layer of layerOrder) {
      layers.push(layersKey[layer]);
    }
    return layers;
  };

  return (
    <DeckGL
      ref={deckGL}
      viewState={viewState}
      onViewStateChange={onViewStateChange}
      // layers={renderLayers()}
      controller={{
        keyboard: false,
      }}
    >
      <StaticMap
        asyncRender={false}
        dragRotate={true}
        reuseMaps={true}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle={settings.map.mapStyle.sat}
        preventStyleDiffing={true}
      />
    </DeckGL>
  );
}
