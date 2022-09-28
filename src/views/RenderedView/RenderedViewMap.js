/**
 * How to save a screenshot from deck.gl map to a file? 
 // https://codesandbox.io/s/export-react-component-as-image-tgqmq?file=/src/App.js:169-175
 // https://github.com/xap5xap/image-export-deckgl-rect/blob/master/src/App.js
//  https://gist.github.com/adamilyas/88445938af94b2d29723f92272123f43 
 * 
 */

import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import DeckGL from "deck.gl";
import { SimpleMeshLayer } from "@deck.gl/mesh-layers";
import { OBJLoader } from "@loaders.gl/obj";
import { processGridData } from "../CityScopeJS/DeckglMap/deckglLayers/GridLayer";
import { CubeGeometry } from "@luma.gl/engine";
import { mapSettings } from "../../settings/settings";
import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button, TextField } from "@mui/material";
import axios from "axios";

const cube = new CubeGeometry({ type: "x,z", xlen: 0, ylen: 0, zlen: 0 });

export default function RenderedViewMap() {
  const refMap = useRef();
  const refDeckgl = useRef();
  const containerDivRef = useRef();
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState(
    "Aerial view of the MIT Campus in Cambridge, Massachusetts, with new buildings and development in the center. Realistic. Accurate. Sunset with long shadows. Beautiful."
  );

  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const GEOGRID = processGridData(cityIOdata);
  const header = GEOGRID.properties.header;

  const midGrid = () => {
    const lastCell =
      cityIOdata.GEOGRID.features[cityIOdata.GEOGRID.features.length - 1]
        .geometry.coordinates[0][0];
    const firstCell = cityIOdata.GEOGRID.features[0].geometry.coordinates[0][0];
    const midGrid = [
      (firstCell[0] + lastCell[0]) / 2,
      (firstCell[1] + lastCell[1]) / 2,
    ];
    return midGrid;
  };

  const midGridCoordinates = midGrid();
  const [viewState, setViewState] = useState({
    longitude: midGridCoordinates[0],
    latitude: midGridCoordinates[1],
    zoom: 15,
    bearing: 360 - header.rotation,
    pitch: 45,
  });

  const [mergeCanvas] = useState(document.createElement("canvas"));

  const blobToDataUrl = (blob) => {
    return new Promise((r) => {
      let a = new FileReader();
      a.onload = r;
      a.readAsDataURL(blob);
    }).then((e) => e.target.result);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => {
          if (!refMap.current || !refDeckgl.current) {
            return;
          }
          const mapGL = refMap.current.getMap();
          const deck = refDeckgl.current.deck;
          const mapboxCanvas = mapGL.getCanvas();

          deck.redraw(true);
          const deckglCanvas = deck.canvas;

          mergeCanvas.width = mapboxCanvas.width;
          mergeCanvas.height = mapboxCanvas.height;

          var context = mergeCanvas.getContext("2d");

          context.globalAlpha = 1.0;
          context.drawImage(mapboxCanvas, 0, 0);
          context.globalAlpha = 1.0;
          context.drawImage(deckglCanvas, 0, 0);

          const jpegFile = mergeCanvas.toDataURL("image/jpeg");
          setImage(jpegFile);

          mergeCanvas.toBlob(async (blob) => {
            var formData = new FormData();
            formData.append("image", blob, "image.jpg");
            formData.append("prompt", prompt);
            formData.append("from", "frontend");

            await axios({
              method: "post",
              "Access-Control-Allow-Origin": "*",
              mode: "no-cors",
              url: "http://18.27.78.190:8080/",
              data: formData,
              headers: {
                "Content-Type": "multipart/form-data",
              },
              responseType: "blob",
            })
              .then(async (res) => {
                let dataUrl = await blobToDataUrl(res.data);
                setImage(dataUrl);
              })
              .catch((error) => {
                if (error.response) {
                  console.log(error.response.data);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                } else if (error.request) {
                  console.log(error.request);
                } else {
                  console.log("Error", error.message);
                }
              });
          });
        }}
      >
        Capture
      </Button>
      <TextField
        id="outlined-basic"
        label={prompt}
        variant="outlined"
        // on change, update the state
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* a small div  in the top left corner, above all the rest, that displays the image  */}
      <div
        style={{
          position: "absolute",
          top: 100,
          right: 0,
          zIndex: 1000,
  
        }}
      >
        {image && (
          <img width="500vw" height="500vh" src={image} alt="screenshot" />
        )}
      </div>

      <div
        ref={containerDivRef}
        style={{
          height: "50vh",
          width: "50vw",
          position: "relative",
        }}
      >
        <DeckGL
          ref={refDeckgl}
          viewState={viewState}
          onViewStateChange={({ viewState }) => setViewState(viewState)}
          controller={{
            touchZoom: true,
            touchRotate: true,
            keyboard: false,
          }}
          layers={[
            new SimpleMeshLayer({
              id: "mesh-layer",
              data: GEOGRID.features,
              loaders: [OBJLoader],
              mesh: cube,

              getPosition: (d) => {
                const pntArr = d.geometry.coordinates[0];
                const first = pntArr[1];
                const last = pntArr[pntArr.length - 2];
                const center = [
                  (first[0] + last[0]) / 2,
                  (first[1] + last[1]) / 2,
                  // add the height of the grid cell
                  d.properties.height.length > 1
                    ? d.properties.height[1]
                    : d.properties.height,
                ];
                return center;
              },
              getColor: (d) =>
                d.properties.interactive ? d.properties.color : [0, 0, 0, 0],
              opacity: 0.75,
              getOrientation: (d) => [-180, header.rotation, -90],
              getScale: (d) => [
                GEOGRID.properties.header.cellSize / 2,
                d.properties.height.length > 1
                  ? d.properties.height[1] 
                  : d.properties.height,
                GEOGRID.properties.header.cellSize / 2,
              ],

              updateTriggers: {
                getScale: GEOGRID,
              },
            }),
          ]}
        >
          <Map
            ref={refMap}
            preserveDrawingBuffer={true} //! This is critical to preserve the WebGL drawing buffer
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            mapStyle={mapSettings.map.mapStyle.normal}
          />
        </DeckGL>
      </div>
    </>
  );
}
