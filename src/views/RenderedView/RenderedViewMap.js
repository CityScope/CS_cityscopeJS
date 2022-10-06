/**
 * How to save a screenshot from deck.gl map to a file? 
 // https://codesandbox.io/s/export-react-component-as-image-tgqmq?file=/src/App.js:169-175
 // https://github.com/xap5xap/image-export-deckgl-rect/blob/master/src/App.js
//  https://gist.github.com/adamilyas/88445938af94b2d29723f92272123f43 
 * 
 */

import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import DeckGL from "deck.gl";
import { SimpleMeshLayer } from "@deck.gl/mesh-layers";
import { OBJLoader } from "@loaders.gl/obj";
import { processGridData } from "../CityScopeJS/DeckglMap/deckglLayers/GridLayer";
import { CubeGeometry } from "@luma.gl/engine";
import { mapSettings } from "../../settings/settings";
import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import LoadingModules from "../../Components/LoadingModules";
import {
  Button,
  CircularProgress,
  TextField,
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
} from "@mui/material";

import axios from "axios";

const cube = new CubeGeometry({ type: "x,z", xlen: 0, ylen: 0, zlen: 0 });

export default function RenderedViewMap() {
  // fix deck view rotate
  useEffect(() => {
    document.addEventListener("contextmenu", (evt) => evt.preventDefault());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refMap = useRef();
  const refDeckgl = useRef();
  const renderDivRef = useRef();

  const [renderedImage, setRenderedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState(
    "Aerial view of the MIT Campus in Cambridge, Massachusetts. Realistic. Accurate. Sunset with long shadows. Beautiful."
  );
  const [userSeed, setUserSeed] = useState(1024);
  const [serverURL, setServerURL] = useState(
    "https://virtualscope.media.mit.edu/"
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

  const handleCapture = () => {
    if (!refMap.current || !refDeckgl.current) {
      return;
    }
    setIsLoading(true);
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
    setRenderedImage(jpegFile);
    renderDivRef.current?.scrollIntoView({ behavior: "smooth" });

    mergeCanvas.toBlob(async (blob) => {
      var formData = new FormData();
      formData.append("image", blob, "image.jpg");
      formData.append("prompt", prompt);
      formData.append("user_seed", userSeed);
      formData.append("from", "frontend");

      const config = {
        method: "POST",
        url: serverURL,
        data: formData,
        responseType: "arraybuffer",
      };
      await axios(config)
        .then(async (res) => {
          const buffer = Buffer.from(res.data, "base64");
          const im = await blobToDataUrl(new Blob([buffer]));
          setRenderedImage(im);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
        });
    });
  };

  const blobToDataUrl = (data) => {
    return new Promise((r) => {
      let a = new FileReader();
      a.onload = r;
      a.readAsDataURL(data);
    }).then((e) => e.target.result);
  };

  return (
    <>
      <Box p={2}>
        <Grid container spacing={2}>
          {/* TEXT */}
          <Grid item>
            {isLoading && <LoadingModules loadingModules={["..."]} />}

            <Typography variant="caption">
              DeepScope uses a machine learning model to generate urban scenes
              in real-time, based on designs preform in the CitySCcope platform.
              By implementing 'Stable diffusion', an open-source Transformer
              model, this tool allows for real-time prototyping and
              visualizations of urban design proposals, bypassing the need for
              expensive and time-consuming rendering.
            </Typography>
          </Grid>

          <Grid item xs={12} md={7}>
            <TextField
              fullWidth
              id="outlined-basic"
              required
              label="Text Prompt Description of the Scene"
              defaultValue={prompt}
              variant="outlined"
              onChange={(e) => setPrompt(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              id="outlined-basic"
              InputProps={{
                inputProps: {
                  max: 10000,
                  min: 0,
                },
              }}
              label="Random seed"
              defaultValue={userSeed}
              variant="outlined"
              type="number"
              onChange={(e) => setUserSeed(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Server URL"
              defaultValue={serverURL}
              variant="outlined"
              onChange={(e) => setServerURL(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Button
              fullWidth
              color="secondary"
              variant="outlined"
              onClick={handleCapture}
              disabled={isLoading}
            >
              {!isLoading && "Capture & Render"}
              {isLoading && (
                <>
                  <CircularProgress size={14} />
                  <Typography>
                    Rendering captured view... [can take ~15 seconds]
                  </Typography>
                </>
              )}
            </Button>
          </Grid>
          {/* Deck Map */}
          <Grid item xs={12}>
            <Paper
              variant="outlined"
              sx={{
                variant: "outlined",
                p: 2,
                flexDirection: "column",
                display: "flex",
              }}
            >
              <Stack spacing={2} direction="column">
                <Typography variant="h5">CityScope Model View</Typography>
                <Box
                  sx={{
                    height: "576px",
                    minHeight: "576px",
                    width: "auto",
                    position: "relative",
                  }}
                >
                  <DeckGL
                    ref={refDeckgl}
                    viewState={viewState}
                    onViewStateChange={({ viewState }) =>
                      setViewState(viewState)
                    }
                    controller={
                      isLoading
                        ? false
                        : {
                            touchZoom: true,
                            touchRotate: true,
                            keyboard: false,
                          }
                    }
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
                              ? d.properties.height[1] > 1
                                ? d.properties.height[1] / 2
                                : 1
                              : d.properties.height > 1
                              ? d.properties.height / 2
                              : 1,
                          ];
                          return center;
                        },
                        getColor: (d) =>
                          d.properties.interactive
                            ? d.properties.color
                            : [0, 0, 0, 0],
                        opacity: 0.75,
                        getOrientation: (d) => [-180, header.rotation, -90],
                        getScale: (d) => [
                          GEOGRID.properties.header.cellSize / 2,
                          d.properties.height.length > 1
                            ? d.properties.height[1] > 1
                              ? d.properties.height[1] / 2
                              : 1
                            : d.properties.height > 1
                            ? d.properties.height / 2
                            : 1,
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
                </Box>
              </Stack>
            </Paper>
          </Grid>
          {/* Result IMG */}
          <Grid item xs={12}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: "auto",
                width: "auto",
              }}
            >
              <Stack spacing={2} direction="column">
                <Typography variant="h5">Captured & Rendered View</Typography>

                {renderedImage && (
                  <div ref={renderDivRef}>
                    <img
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        minWidth: "100%",
                        objectFit: "contain",
                        filter: isLoading ? "blur(3px)" : "none",
                        WebkitFilter: isLoading ? "blur(3px)" : "none",
                      }}
                      src={renderedImage}
                      alt="screenshot"
                    />
                  </div>
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
