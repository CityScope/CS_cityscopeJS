import {PathLayer} from '@deck.gl/layers';

  /**
   * Data format:
   * [
   *   {
   *     path: [[-122.4, 37.7], [-122.5, 37.8], [-122.6, 37.85]],
   *     name: 'Richmond - Millbrae',
   *     color: [255, 0, 0]
   *   },
   *   ...
   * ]
   */
  export default function PathBaseLayer({data, opacity}){
    if(data.path){
        return new PathLayer({
          id: 'path-layer',
          data: data.path.data,
          pickable: data.path.properties.pickable || true,
          widthScale: data.path.properties.widthScale || 20,
          widthMinPixels: data.path.properties.widthMinPixels || 2,
          getPath: d => d.path,
          getColor: d => d.color || [255, 0, 0],
          getWidth: d => d.width || 5,
          opacity
        });
      
    }
  }
