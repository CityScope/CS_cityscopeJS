import { SimpleMeshLayer } from "@deck.gl/mesh-layers";
import { OBJLoader } from "@loaders.gl/obj";

export default function MeshLayer({ data: cityIOdata, opacity }) {
  if (cityIOdata && cityIOdata.GEOGRID && cityIOdata.GEOGRIDDATA) {
    console.log("cityIOdata", cityIOdata);
    return new SimpleMeshLayer({
      id: "mesh-layer",
      data: cityIOdata.GEOGRID && cityIOdata.GEOGRID.features,
      loaders: [OBJLoader],
      mesh:
        "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/humanoid_quad.obj",
      getPosition: (d) => {
        const pntArr = d.geometry.coordinates[0];
        const first = pntArr[1];
        const last = pntArr[pntArr.length - 2];
        const center = [(first[0] + last[0]) / 2, (first[1] + last[1]) / 2];
        return center;
      },
      getColor: (d) => [0, 0, Math.random() * 255],
      getOrientation: [0, 0, 0],
      sizeScale: opacity*100,
      updateTriggers: {
        sizeScale: opacity,
      },
    });
  }
}
