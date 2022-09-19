import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "mapbox-gl/dist/mapbox-gl.css";
import { mapSettings as settings } from "../../../../settings/settings";
import { GeoJsonLayer, TripsLayer, HeatmapLayer, TextLayer } from "deck.gl";
import { processGridData } from "../../../CityScopeJS/DeckglMap/deckglLayers/GridLayer";
import { hexToRgb } from "../../../../utils/utils";
import DeckMap from "./DeckMap";

export default function ProjectionDeckMap(props) {
  const editMode = props.editMode;
  const viewStateEditMode = props.viewStateEditMode;
  const layersVisibilityControl = props.layersVisibilityControl;



  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const TUIobject = cityIOdata && cityIOdata.tui;

  const [time, setTime] = useState(settings.map.layers.ABM.startTime);
  const [animation] = useState({});

  const animate = () => {
    (TUIobject && TUIobject.ABM && TUIobject.ABM.active) ||
      (layersVisibilityControl.ABM &&
        setTime((t) => {
          return t > settings.map.layers.ABM.endTime
            ? settings.map.layers.ABM.startTime
            : t + settings.map.layers.ABM.animationSpeed;
        }));
    animation.id = window.requestAnimationFrame(animate);
  };

  useEffect(() => {
    animation.id = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animation.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation]);

  const layersArray = (layersVisibilityControl) => {
    return [
      new GeoJsonLayer({
        id: "GRID",
        visible:
          (TUIobject && TUIobject.GRID && TUIobject.GRID.active) ||
          layersVisibilityControl.GRID,
        data: processGridData(cityIOdata),
        opacity: 0.5,
        extruded: false,
        wireframe: true,
        lineWidthScale: 1,
        lineWidthMinPixels: 1,
        getFillColor: (d) => d.properties.color,
        transitions: {
          getFillColor: 500,
        },
      }),

      new HeatmapLayer({
        id: "ACCESS",
        visible:
          (TUIobject && TUIobject.ACCESS && TUIobject.ACCESS.active) ||
          layersVisibilityControl.ACCESS,
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
        visible:
          (TUIobject && TUIobject.TEXT && TUIobject.TEXT.active) ||
          layersVisibilityControl.TEXT,
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
        visible:
          (TUIobject && TUIobject.ABM && TUIobject.ABM.active) ||
          layersVisibilityControl.ABM,
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
  };

  return (
    <DeckMap
      editMode={editMode}
      viewStateEditMode={viewStateEditMode}
      layers={layersArray(layersVisibilityControl)}
    />
  );
}
