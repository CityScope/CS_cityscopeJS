import {IconLayer} from '@deck.gl/layers';

  /**
   * Data format:
   * [
   *   {coordinates: [-122.466233, 37.684638]},
   *   ...
   * ]
   */
  export default function IconBaseLayer({data, opacity}){

    return new IconLayer({
          id: data.id,
          data: data.data,
          pickable: data.properties.pickable || true,
          // iconAtlas and iconMapping are required
          // getIcon: return a string
          getIcon: d => ({
            url: d.icon,
            width: d.width || 128,
            height: d.height || 128,
            anchorY: d.anchorY || 128
          }),
          sizeScale: data.properties.sizeScale || 10,
          sizeMaxPixels: data.properties.sizeMaxPixels || 10,
          getPosition: d => [d.coordinates[0],d.coordinates[1],d.elevation || 30],
          opacity
        });
    
  }
