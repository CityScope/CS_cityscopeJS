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
  Container,
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
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState(
    "Aerial view of the MIT Campus in Cambridge, Massachusetts, with new buildings and development in the center. Realistic. Accurate. Sunset with long shadows. Beautiful."
  );
  const [userSeed, setUserSeed] = useState(1024);

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
    setImage(jpegFile);
    mergeCanvas.toBlob(async (blob) => {
      var formData = new FormData();
      formData.append("image", blob, "image.jpg");
      formData.append("prompt", prompt);
      formData.append("user_seed", userSeed);
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
          setIsLoading(false);
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
  };

  const blobToDataUrl = (blob) => {
    return new Promise((r) => {
      let a = new FileReader();
      a.onload = r;
      a.readAsDataURL(blob);
    }).then((e) => e.target.result);
  };

  return (
    <>
      {isLoading && <LoadingModules loadingModules={[""]} />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 5, mb: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    variant: "outlined",
                    p: 2,
                    flexDirection: "column",
                    display: "flex",
                    flexGrow: 1,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item>
                      <Typography variant="h2">DeepScope 2.0</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography>
                        DeepScope attempts to substitute common practices of
                        urban design with a machine-learnt, generative
                        visualization approach. By implementing 'Stable
                        diffusion', an open-source Transformer model, this tool
                        allows for real-time prototyping and visualizations of
                        urban design processes.
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
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
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        id="outlined-basic"
                        InputProps={{
                          inputProps: {
                            max: 10000,
                            min: 0,
                          },
                        }}
                        label="Select a random seed (0-10000)"
                        defaultValue={userSeed}
                        variant="outlined"
                        type="number"
                        onChange={(e) => setUserSeed(e.target.value)}
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
                            <Typography sx={{ p: 1 }}>
                              Rendering captured view... [can take ~15 seconds]
                            </Typography>
                          </>
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
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
                  <Typography variant="h4">CityScope Model View</Typography>
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
                        mapboxApiAccessToken={
                          process.env.REACT_APP_MAPBOX_TOKEN
                        }
                        mapStyle={mapSettings.map.mapStyle.normal}
                      />
                    </DeckGL>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
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
                  <Typography variant="h4">Captured & Rendered View</Typography>

                  {image && (
                    <img
                      style={{ height: "576px" }}
                      src={image}
                      alt="screenshot"
                    />
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
