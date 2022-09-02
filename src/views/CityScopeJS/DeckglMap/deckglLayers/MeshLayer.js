import { SimpleMeshLayer } from "@deck.gl/mesh-layers";
import { OBJLoader } from "@loaders.gl/obj";

export default function MeshLayer({ data, opacity }) {
  if (data && data.features) {
    return new SimpleMeshLayer({
      id: "mesh-layer",
      data: data.features,
      loaders: [OBJLoader],
      mesh: "./obj/model.obj",
      getPosition: (d) => {
        const pntArr = d.geometry.coordinates[0];
        const first = pntArr[1];
        const last = pntArr[pntArr.length - 2];
        const center = [(first[0] + last[0]) / 2, (first[1] + last[1]) / 2];
        return center;
      },
      getColor: (d) =>
        // d.properties.color,
        [255, 255, 255, 255],

      getOrientation: (d) => [-180, Math.ceil(Math.random() * 4) * 90, -90],
      getScale: (d) =>
        d.properties.height > 0
          ? [
              data.properties.header.cellSize / 2,
              opacity * d.properties.height ,
              data.properties.header.cellSize / 2,
            ]
          : [0, 0, 0],
      updateTriggers: {
        getScale: opacity,
      },
    });
  }
}
