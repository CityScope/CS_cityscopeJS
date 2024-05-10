import {SimpleMeshLayer} from '@deck.gl/mesh-layers';
import {OBJLoader} from "@loaders.gl/obj";

  /**
   * Data format:
   * [
   *   {
   *     position: [-122.45, 37.7],
   *     angle: 0,
   *     color: [255, 0, 0]
   *   },
   *   {
   *     position: [-122.46, 37.73],
   *     angle: 90,
   *     color: [0, 255, 0]
   *   },
   *   ...
   * ]
   */
  export default function SimpleMeshBaseLayer({data, opacity}){

    return new SimpleMeshLayer({
          id: data.id,
          data: data.data,
          mesh: data.properties.mesh || 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/humanoid_quad.obj',
          getPosition: d => [d.position[0],d.position[1],0],
          getColor: d => d.color,
          getOrientation: d => [0, d.angle, 0],
          loaders:[OBJLoader],
          sizeScale: data.properties.sizeScale || 1,
          opacity
        });
    
  }
