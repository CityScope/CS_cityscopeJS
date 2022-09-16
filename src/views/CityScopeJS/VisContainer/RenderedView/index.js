import { useState } from "react";
import { useSelector } from "react-redux";
import DeckGL from "deck.gl";
import { LightingEffect, AmbientLight, _SunLight } from "@deck.gl/core";
import { SimpleMeshLayer } from "@deck.gl/mesh-layers";
import { OBJLoader } from "@loaders.gl/obj";
import { Slider, Typography } from "@mui/material/";
import { processGridData } from "../../DeckglMap/deckglLayers/GridLayer";
import { PlaneGeometry, CubeGeometry } from "@luma.gl/engine";

const plane = new PlaneGeometry({
  type: "x,z",
  xlen: 1,
  ylen: 1,
});

const cube = new CubeGeometry();

const material = {};
material.ambient = 0.5;
material.diffuse = 0.8;
material.shininess = 25;
material.specularColor = [255, 255, 200];

const ambientLight = new AmbientLight({
  color: [255, 218, 185],
  intensity: 0.7,
});

const directionalLight = new _SunLight({
  color: [200, 200, 255],
  timestamp: new Date().getTime(),
  intensity: 1.5,
  _shadow: true,
});

const lightingEffect = new LightingEffect({ ambientLight, directionalLight });
lightingEffect.shadowColor = [0, 0, 0, 0.5];

export default function RenderedView() {
  const [sliderVal, setSliderValue] = useState(30);

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  lightingEffect.directionalLights[0].timestamp = sliderVal * 1000000;

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
    orthographic: true,
  });

  return (
    <>
      <div
        style={{
          height:"30vh",
          position: "relative",
        }}
      >
        <DeckGL
          viewState={viewState}
          onViewStateChange={(v) =>
            setViewState({ ...v.viewState, orthographic: true, pitch: 45 })
          }
          controller={{
            touchZoom: true,
            touchRotate: true,

            keyboard: false,
          }}
          effects={[lightingEffect]}
          layers={[
            new SimpleMeshLayer({
              id: "mesh-layer",
              data: GEOGRID.features,
              loaders: [OBJLoader],
              mesh: cube,
              //  "./obj/model.obj",
              material: material,
              getPosition: (d) => {
                const pntArr = d.geometry.coordinates[0];
                const first = pntArr[1];
                const last = pntArr[pntArr.length - 2];
                const center = [
                  (first[0] + last[0]) / 2,
                  (first[1] + last[1]) / 2,
                ];
                return center;
              },
              getColor: [255, 255, 255, 255],

              getOrientation: (d) => [-180,  header.rotation, -90],
              getScale: (d) => [
                GEOGRID.properties.header.cellSize / 2 - 1,
                d.properties.height,
                GEOGRID.properties.header.cellSize / 2 - 1,
              ],
              updateTriggers: {
                getScale: GEOGRID,
              },
              transitions: {
                getScale: 300,
              },
            }),

            new SimpleMeshLayer({
              data: [0],
              mesh: plane,
              getPosition: (_) => [
                midGridCoordinates[0],
                midGridCoordinates[1],
                0,
              ],
              getOrientation: [0, 0, -90],
              getScale: [10000, 1, 10000],
              getColor: [100, 100, 100, 255],
            }),
          ]}
        />
      </div>
      <Typography variant="caption">Time of Day</Typography>
      <Slider size="small" value={sliderVal} onChange={handleSliderChange} />
    </>
  );
}
