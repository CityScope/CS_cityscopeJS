import { SimpleMeshLayer } from "deck.gl";
import { CubeGeometry } from "@luma.gl/engine";
import { OBJLoader } from "@loaders.gl/obj";
import { numberToColorHsl } from "../../../../utils/utils";

export default function AccessLayer({ data, intensity, selected }) {
  const accessData = data.access && data.access.features;
  const cube = new CubeGeometry({ type: "x,z", xlen: 0, ylen: 0, zlen: 0 });
  const header = data.GEOGRID.properties.header;
  // const colors = [
  //   [255, 0, 0],
  //   [255, 167, 0],
  //   [255, 244, 0],
  //   [163, 255, 0],
  //   [44, 186, 0],
  // ];
  // return new HeatmapLayer({
  //   id: "ACCESS",
  //   colorRange: colors,
  //   debounceTimeout: 800,
  //   radiusPixels: intensity || 35,
  //   intensity: 1,
  //   weightsTextureSize: 1024,
  //   threshold: 0.3,

  //   data: accessData && accessData,
  //   getPosition: (d) => d.geometry.coordinates,
  //   getWeight: (d) => d.properties[selected],
  //   updateTriggers: {
  //     getWeight: selected,
  //   },
  // });

  return new SimpleMeshLayer({
    id: "ACCESS",
    opacity: 0.1 + intensity / 100,

    data: accessData && accessData,
    loaders: [OBJLoader],
    mesh: cube,
    getPosition: (d) => [
      d.geometry.coordinates[0],
      d.geometry.coordinates[1],
      1,
    ],

    getColor: (d) => {
      const selectedWeight = (w) => {
        if (w > 0 && w < 1) {
          return w;
        } else if (w >= 1) {
          return 1;
        } else {
          return 0;
        }
      };
      // if the heatmap value is null or undefined, return transparent color
      if (
        d.properties[selected] === undefined ||
        d.properties[selected] === null
      ) {
        return [0, 0, 0, 0];
        // if the heatmap value is a float, return the color based on the value
      } else {
        const rgb = numberToColorHsl(
          selectedWeight(d.properties[selected]),
          0,
          1
        );
        return [rgb[0], rgb[1], rgb[2], 200];
      }
    },

    getOrientation: (d) => [-180, header.rotation, -90],
    getScale: (d) => [
      data.GEOGRID.properties.header.cellSize / (2 + intensity / 100),
      1 + d.properties[selected] * intensity,
      data.GEOGRID.properties.header.cellSize / (2 + intensity / 100),
    ],
    updateTriggers: {
      getScale: selected,
    },
    transitions: {
      getColor: 500,
      getScale: 500,
    },
  });
}
