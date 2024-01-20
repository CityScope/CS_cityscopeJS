import { useEffect, useState } from "react";
import { DeckGL } from "@deck.gl/react";
import { _GlobeView as GlobeView, COORDINATE_SYSTEM } from "@deck.gl/core";
import { TileLayer } from "@deck.gl/geo-layers";
import { FlyToInterpolator } from "deck.gl";
import { LineLayer, IconLayer, TextLayer, BitmapLayer } from "@deck.gl/layers";
import icon from "./legoio.png";
import SelectedTable from "../SelectedTable";

export default function CityIOdeckGLmap(props) {
  const [markerInfo, setMarkerInfo] = useState([]);
  const [clicked, setClicked] = useState();
  const [zoom, setZoom] = useState();
  const INIT_VIEW = {
    longitude: -71.060929,
    latitude: 42.3545259,
    zoom: 1,
    pitch: 0,
    bearing: 0,
    zHeight: 2000000,
  };

  const [viewport, setViewport] = useState(INIT_VIEW);
  const [initialViewState, setInitialViewState] = useState(viewport);
  const [intervalId, setIntervalId] = useState(null);

  // boolean for hovering flag
  let isHovering = false;

  // use FlyToInterpolator to randomly select a table and fly to it once a second
  // fulfil the first fly immediately.
  const flyToTable = () => {
    let randomIndex = Math.floor(Math.random() * markerInfo.length);
    setInitialViewState({
      longitude: markerInfo[randomIndex].coord.to[0],
      latitude: markerInfo[randomIndex].coord.to[1],
      zoom: 3,
      pitch: 0,
      bearing: 0,
      transitionDuration: 8000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: (t) =>
        // ease out slow start, fast middle, slow end
        t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    });
  };

  useEffect(() => {
    // check if there are any tables to fly to
    if (markerInfo.length === 0) return;
    flyToTable();

    let interval = setInterval(() => {
      flyToTable();
    }, 10000);
    setIntervalId(interval);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [markerInfo]);

  useEffect(() => {
    if (clicked) {
      clearInterval(intervalId);
    }
    // eslint-disable-next-line
  }, [clicked]);

  useEffect(() => {
    // set initial zoom level to reflect layers appearance
    setZoom(INIT_VIEW.zoom);
    document
      .getElementById("deckgl-wrapper")
      .addEventListener("contextmenu", (evt) => evt.preventDefault());
    // set the deckgl-wrapper color to black
    document.getElementById("deckgl-wrapper").style.backgroundColor = "black";
  }, [INIT_VIEW.zoom]);

  useEffect(() => {
    let markersArr = [];

    props.cityIOdata.forEach((table, index) => {
      markersArr.push({
        tableURL: table.tableURL,
        tableName: table.tableName,
        index: index,
        tableHeader: table.tableHeader,
        coord: {
          from: [table.tableHeader.longitude, table.tableHeader.latitude],
          to: [
            table.tableHeader.longitude + index / 10,
            table.tableHeader.latitude + index / 10,
            INIT_VIEW.zHeight,
          ],
        },
      });
    });

    setMarkerInfo(markersArr);
  }, [props, INIT_VIEW.zHeight]);

  const layers = [
    new TileLayer({
      data:
        `https://api.mapbox.com/styles/v1/relnox/cjlu6w5sc1dy12rmn4kl2zljn/tiles/256/{z}/{x}/{y}?access_token=` +
        process.env.REACT_APP_MAPBOX_TOKEN +
        "&attribution=false&logo=false&fresh=true",
      minZoom: 0,
      maxZoom: 19,
      tileSize: 96,
      opacity: 5,
      renderSubLayers: (props) => {
        const {
          bbox: { west, south, east, north },
        } = props.tile;
        return new BitmapLayer(props, {
          data: null,
          image: props.data,
          _imageCoordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
          bounds: [west, south, east, north],
        });
      },
    }),

    new LineLayer({
      id: "LineLayer",
      data: markerInfo,
      pickable: true,
      getWidth: zoom < 2 ? 0.3 : 0.1,
      getSourcePosition: (d) => d.coord.from,
      getTargetPosition: (d) => d.coord.to,
      getColor: [255, 255, 255, 100],
    }),
    new TextLayer({
      id: "text-layer",
      data: markerInfo,
      pickable: true,
      getPosition: (d) => d.coord.to,
      getText: (d) => d.tableName,
      getColor: [255, 255, 255],
      getSize: zoom < 2 ? 0 : 5,
      getAngle: 0,
      getPixelOffset: [10, 5],
      getTextAnchor: "start",
      getAlignmentBaseline: "center",
    }),
    new IconLayer({
      id: "icon-layer",
      data: markerInfo,
      pickable: true,
      iconAtlas: icon,
      onClick: (d) => {
        setInitialViewState({
          longitude: d.object.coord.to[0],
          latitude: d.object.coord.to[1],
          zoom: 3,
          pitch: 0,
          bearing: 0,
          transitionDuration: 1000,
          transitionInterpolator: new FlyToInterpolator(),
        });

        setClicked(d);
      },
      iconMapping: {
        marker: { x: 0, y: 0, width: 768, height: 768, mask: false },
      },
      getIcon: (d) => "marker",
      sizeScale: 1,
      getSize: zoom < 5 ? 20 : 5,
      getPosition: (d) => [d.coord.to[0], d.coord.to[1], INIT_VIEW.zHeight],
    }),
  ];

  return (
    <div
      // black background
      style={{ backgroundColor: "black" }}
      width="100%"
      height="100%"
    >
      {clicked && clicked.object && (
        <SelectedTable
          clicked={clicked.object}
          onClose={() => setClicked(null)}
        />
      )}

      <DeckGL
        views={new GlobeView()}
        onHover={({ object }) => (isHovering = Boolean(object))}
        getCursor={({ isDragging }) =>
          isDragging ? "grabbing" : isHovering ? "crosshair" : "grab"
        }
        layers={layers}
        controller={true}
        initialViewState={initialViewState}
        onViewportChange={setViewport}
        onViewStateChange={(d) => setZoom(d.viewState.zoom)}
      ></DeckGL>
    </div>
  );
}
