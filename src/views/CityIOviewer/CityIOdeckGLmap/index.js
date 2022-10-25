import { useEffect, useState } from "react";
import { DeckGL } from "@deck.gl/react";
import { _GlobeView as GlobeView, COORDINATE_SYSTEM } from "@deck.gl/core";
import { TileLayer } from "@deck.gl/geo-layers";
import { FlyToInterpolator } from "deck.gl";
import { LineLayer, IconLayer, TextLayer, BitmapLayer } from "@deck.gl/layers";
import icon from "./legoio.png";

import SelectedTable from "../SelectedTable";

// * draggable pin https://github.com/visgl/react-map-gl/tree/6.1-release/examples/draggable-markers

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
  // boolean for hovering flag
  let isHovering = false;

  useEffect(() => {
    // set initial zoom level to refelct layers appearance
    setZoom(INIT_VIEW.zoom);
    document
      .getElementById("deckgl-wrapper")
      .addEventListener("contextmenu", (evt) => evt.preventDefault());
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
        "https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png",
      minZoom: 0,
      maxZoom: 19,
      tileSize: 96,
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
      getWidth: zoom < 2 ? 0.5 : 0,
      getSourcePosition: (d) => d.coord.from,
      getTargetPosition: (d) => d.coord.to,
      getColor: [	33, 150, 243, 100],
    }),
    new TextLayer({
      id: "text-layer",
      data: markerInfo,
      pickable: true,
      getPosition: (d) => d.coord.to,
      getText: (d) => d.tableName,
      getColor: [255, 82, 120],
      getSize: zoom < 2 ? 0 : 10,
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
      getSize: zoom < 5 ? 20 : 10,
      getPosition: (d) => [d.coord.to[0], d.coord.to[1], INIT_VIEW.zHeight],
    }),
  ];

  return (
    <>
      {clicked && clicked.object && <SelectedTable clicked={clicked.object} />}

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
    </>
  );
}
