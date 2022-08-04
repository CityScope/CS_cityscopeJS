import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Map from "react-map-gl";
import DeckGL from "@deck.gl/react";
import "mapbox-gl/dist/mapbox-gl.css";
import { mapSettings } from "../../../../settings/settings";
import { GeoJsonLayer, TripsLayer } from "deck.gl";
import { processGridData } from "../../../CityScopeJS/DeckglMap/deckglLayers/GridLayer";

export default function ProjectionDeckMap(props) {
  const editMode = props.editMode;
  const deckGLref = useRef(null);
  const settings = mapSettings;
  const [viewState, setViewState] = useState();
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
      const vs = localStorage.getItem("projectionViewStateStorage");
      setViewState(JSON.parse(vs));
    } else {
      // zoom map on CS table location
      setViewStateToTableHeader();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onViewStateChange = ({ viewState }) => {
    //    save current view state to local storage
    localStorage.setItem(
      "projectionViewStateStorage",
      JSON.stringify(viewState)
    );
    // ! lock bearing to avoid odd rotation
    setViewState({ ...viewState, pitch: 0, orthographic: true });
  };

  const [time, setTime] = useState(settings.map.layers.ABM.startTime);
  const [animation] = useState({});

  const animate = () => {
    setTime((t) => {
      return t > settings.map.layers.ABM.endTime
        ? settings.map.layers.ABM.startTime
        : t + settings.map.layers.ABM.animationSpeed;
    });
    animation.id = window.requestAnimationFrame(animate);
  };

  useEffect(() => {
    animation.id = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(animation.id);
  }, [animation]);

  const renderLayers = [
    new GeoJsonLayer({
      id: "GRID",
      data: processGridData(cityIOdata),
      opacity: 0.8,
      extruded: true,
      wireframe: true,
      lineWidthScale: 1,
      lineWidthMinPixels: 2,
      getElevation: (d) => d.properties.height,
      getFillColor: (d) => d.properties.color,

      transitions: {
        getFillColor: 500,
        getElevation: 500,
      },
    }),

    new TripsLayer({
      id: "ABM",
      data: cityIOdata.ABM2 && cityIOdata.ABM2.trips,
      getPath: (d) => d.path,
      getTimestamps: (d) => d.timestamps,
      rounded: true,
      fadeTrail: true,
      getWidth: 10,
      trailLength: 200,
      currentTime: time,
    }),
  ];

  return (
    <DeckGL
      ref={deckGLref}
      viewState={viewState}
      onViewStateChange={onViewStateChange}
      layers={renderLayers}
      controller={{
        keyboard: false,
      }}
    >
      {!editMode && (
        <Map
          width="100%"
          height="100%"
          asyncRender={false}
          dragRotate={true}
          reuseMaps={true}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          mapStyle={settings.map.mapStyle.blue}
          preventStyleDiffing={true}
        />
      )}
    </DeckGL>
  );
}
