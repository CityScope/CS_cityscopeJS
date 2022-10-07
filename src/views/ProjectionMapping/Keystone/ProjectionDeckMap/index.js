import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "mapbox-gl/dist/mapbox-gl.css";
import { mapSettings as settings } from "../../../../settings/settings";
import {
  GeoJsonLayer,
  TripsLayer,
  HeatmapLayer,
  TextLayer,
  BitmapLayer,
} from "deck.gl";
import { processGridData } from "../../../CityScopeJS/DeckglMap/deckglLayers/GridLayer";
import { hexToRgb } from "../../../../utils/utils";
import DeckMap from "./DeckMap";
import { TileLayer } from "@deck.gl/geo-layers";

export default function ProjectionDeckMap(props) {
  const editMode = props.editMode;
  const viewStateEditMode = props.viewStateEditMode;
  const layersVisibilityControl = props.layersVisibilityControl;
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const TUIobject = cityIOdata && cityIOdata.tui;

  const [time, setTime] = useState(settings.map.layers.ABM.startTime);
  const [animation] = useState({});

  const backgroundLayer = new TileLayer({
    data:
      "https://api.mapbox.com/styles/v1/relnox/ck0h5xn701bpr1dqs3he2lecq/tiles/256/{z}/{x}/{y}?access_token=" +
      process.env.REACT_APP_MAPBOX_TOKEN,
    minZoom: 0,
    maxZoom: 21,
    tileSize: 256,
    visible: true,
    id: "OSM",
    renderSubLayers: (props) => {
      const {
        bbox: { west, south, east, north },
      } = props.tile;

      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north],
      });
    },
  });

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

  const layersArray = () => {
    if (!TUIobject) return [backgroundLayer];
    return [
      new GeoJsonLayer({
        id: "GRID",
        visible: TUIobject.GRID && TUIobject.GRID.active,
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
        visible: TUIobject.ACCESS && TUIobject.ACCESS.active,
        colorRange: [
          [233, 62, 58],
          [237, 104, 60],
          [243, 144, 63],
        ],
        intensity: 1,
        threshold: 0.5,
        data: cityIOdata.access && cityIOdata.access.features,
        getPosition: (d) => d.geometry.coordinates,
        getWeight: (d) =>
          d.properties[TUIobject.ACCESS.toggleArray.curr_active] || 0,
        updateTriggers: {
          getWeight: TUIobject.ACCESS.toggleArray.curr_active,
        },
      }),

      // text layer in the center of each grid cell from the cityIOdata.GEOGRID.features
      new TextLayer({
        id: "text",
        visible: TUIobject.TEXT && TUIobject.TEXT.active,
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
        visible: TUIobject.ABM && TUIobject.ABM.active,
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
      backgroundLayer,
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
