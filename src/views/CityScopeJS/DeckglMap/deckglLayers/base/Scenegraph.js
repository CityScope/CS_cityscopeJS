import {ScenegraphLayer} from '@deck.gl/mesh-layers';

  /**
   * Data format:
   * [
   *   {name: 'Colma (COLM)', code:'CM', address: '365 D Street, Colma CA 94014', exits: 4214, coordinates: [-122.466233, 37.684638]},
   *   ...
   * ]
   */
  export default function ScenegraphBaseLayer({data, opacity}){
    if(data.scenegraph){
        return new ScenegraphLayer({
          id: 'scenegraph-layer',
          data: data.scenegraph.data,
          pickable: data.scenegraph.properties.pickable || true,
          scenegraph: data.scenegraph.properties.scenegraph || 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb',
          getPosition: d => d.coordinates,
          getOrientation: d => [0, Math.random() * 180, 90],
          _animations: {
            '*': {speed: 5}
          },
          sizeScale: data.scenegraph.properties.sizeScale || 500,
          _lighting: 'pbr',
          opacity
        });
      
      
      
    }
  }
