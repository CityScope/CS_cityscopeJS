import {IconLayer} from '@deck.gl/layers';

  /**
   * Data format:
   * [
   *   {coordinates: [-122.466233, 37.684638]},
   *   ...
   * ]
   */
  export default function IconBaseLayer({data, opacity}){
    if(data.icon){
        return new IconLayer({
          id: 'icon-layer',
          data: data.icon.data,
          pickable: data.icon.properties.pickable || true,
          // iconAtlas and iconMapping are required
          // getIcon: return a string
          getIcon: d => ({
            url: d.icon,
            width: d.width || 128,
            height: d.height || 128,
            anchorY: d.anchorY || 128
          }),
          sizeScale: data.icon.properties.sizeScale || 10,
          sizeMaxPixels: data.icon.properties.sizeMaxPixels || 10,
          getPosition: d => [d.coordinates[0],d.coordinates[1],d.elevation || 30],
          opacity
        });
    }
  }
