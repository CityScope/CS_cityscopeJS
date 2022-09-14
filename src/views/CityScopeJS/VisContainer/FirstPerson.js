import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import DeckGL from "deck.gl";
import { FirstPersonView } from "@deck.gl/core";
import {
  LightingEffect,
  AmbientLight,
  DirectionalLight,
  _SunLight,
} from "@deck.gl/core";
import { SimpleMeshLayer } from "@deck.gl/mesh-layers";
import { OBJLoader } from "@loaders.gl/obj";
import Slider from "@mui/material/Slider";
import { processGridData } from "../DeckglMap/deckglLayers/GridLayer";

const sphereMaterial = {};
sphereMaterial.ambient = 0.5;
sphereMaterial.diffuse = 0.5;
sphereMaterial.shininess = 50;
sphereMaterial.specularColor = [255, 255, 255];
const view = new FirstPersonView({ id: "pov", controller: true });

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 0.5,
});
const directionalLight = new _SunLight({
  timestamp: new Date().getTime(),
  color: [255, 255, 255],
  intensity: 1.0,
  _shadow: true,
});

const lightingEffect = new LightingEffect({ directionalLight, ambientLight });
lightingEffect.shadowColor = [0, 0, 0, 0.4];

export default () => {
  const [sliderVal, setSliderValue] = useState(30);

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  lightingEffect.directionalLights[0].timestamp = sliderVal * 1000000;

  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const GEOGRID = processGridData(cityIOdata);
  const header = GEOGRID.properties.header;

  const [viewState, setViewState] = useState();

  const setViewStateToTableHeader = () => {
    const lastCell =
      cityIOdata.GEOGRID.features[cityIOdata.GEOGRID.features.length - 1]
        .geometry.coordinates[0][0];
    const firstCell = cityIOdata.GEOGRID.features[0].geometry.coordinates[0][0];
    const midGrid = [
      (firstCell[0] + lastCell[0]) / 2,
      (firstCell[1] + lastCell[1]) / 2,
    ];
    setViewState({
      ...viewState,
      longitude: midGrid[0],
      latitude: midGrid[1],
      bearing: 360 - header.rotation,
      width: window.innerWidth,
      height: window.innerHeight,
      zoom: 18,
      position: [0, 0, 100],
      pitch: 10,
      far: 1000000,
      near: 0.1,
    });
  };

  useEffect(() => {
    setViewStateToTableHeader();
  }, []);

  return (
    <>
      <div
        style={{
          height: "25vh",
          width: "100%",
          position: "relative",
        }}
      >
        <DeckGL
          views={view}
          effects={[lightingEffect]}
          layers={[
            new SimpleMeshLayer({
              id: "mesh-layer",
              data: GEOGRID.features,
              loaders: [OBJLoader],
              mesh: "./obj/model.obj",
              material: sphereMaterial,
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

              getOrientation: (d) => [-180, 360 - header.rotation, -90],
              getScale: (d) =>
                d.properties.height > 0
                  ? [
                      GEOGRID.properties.header.cellSize / 2,
                      d.properties.height,
                      GEOGRID.properties.header.cellSize / 2,
                    ]
                  : [0, 0, 0],
              updateTriggers: {
                getScale: GEOGRID,
              },
              transitions: {
                getScale: 300,
              },
            }),
          ]}
          viewState={viewState}
          onViewStateChange={(v) => setViewState(v.viewState)}
        />
      </div>

      <Slider
        size="small"
        aria-label="Volume"
        value={sliderVal}
        onChange={handleSliderChange}
      />
    </>
  );
};
