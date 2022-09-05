import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Map from "react-map-gl";
import DeckGL from "@deck.gl/react";
import "mapbox-gl/dist/mapbox-gl.css";
import { mapSettings } from "../../../../settings/settings";
import { GeoJsonLayer, TripsLayer, HeatmapLayer, TextLayer } from "deck.gl";
import { processGridData } from "../../../CityScopeJS/DeckglMap/deckglLayers/GridLayer";
import { hexToRgb } from "../../../../utils/utils";

export default function ProjectionDeckMap(props) {
  const editMode = props.editMode;
  const deckGLref = useRef(null);
  const settings = mapSettings;
  const [viewState, setViewState] = useState();
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const header = cityIOdata.GEOGRID.properties.header;
  const setViewStateToTableHeader = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation]);

  const layersArray = [
    new GeoJsonLayer({
      id: "GRID",
      data: processGridData(cityIOdata),
      opacity: 0.5,
      extruded: false,
      wireframe: true,
      lineWidthScale: 1,
      lineWidthMinPixels: 5,
      getFillColor: (d) => d.properties.color,
      transitions: {
        getFillColor: 500,
      },
    }),

    new HeatmapLayer({
      id: "ACCESS",
      colorRange: [
        [233, 62, 58],
        [237, 104, 60],
        [243, 144, 63],
      ],
      intensity: 0.8,
      threshold: 0.5,
      data: cityIOdata.access && cityIOdata.access.features,
      getPosition: (d) => d.geometry.coordinates,
      getWeight: (d) => d.properties[0],
      updateTriggers: {
        getWeight: [0],
      },
    }),

    // text layer in the center of each grid cell from the cityIOdata.GEOGRID.features
    new TextLayer({
      id: "text",
      data: cityIOdata.GEOGRID && cityIOdata.GEOGRID.features,
      getPosition: (d) => {
        const pntArr = d.geometry.coordinates[0];
        const first = pntArr[1];
        const last = pntArr[pntArr.length - 2];
        const center = [(first[0] + last[0]) / 2, (first[1] + last[1]) / 2];
        return center;
      },

      getText: (d) => {
        var length = 5;
        return d.properties.name.length > length
          ? d.properties.name.substring(0, length - 3) + "..."
          : d.properties.name;
      },
      getColor: (d) => [0, 0, 0],
      getSize: 8,
    }),

    new TripsLayer({
      id: "ABM",
      data: cityIOdata.ABM2 && cityIOdata.ABM2.trips,
      getColor: (d) => {
        let col = hexToRgb(cityIOdata.ABM2.attr.mode[d.mode].color);
        return col;
      },
      getPath: (d) => d.path,
      getTimestamps: (d) => d.timestamps,
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
      layers={layersArray}
      controller={{}}
    >
      {!editMode && (
        <Map
          width="100%"
          height="100%"
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          mapStyle={settings.map.mapStyle.blue}
        />
      )}
    </DeckGL>
  );
}
