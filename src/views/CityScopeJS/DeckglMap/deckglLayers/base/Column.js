import {ColumnLayer} from '@deck.gl/layers';

  /**
   * Data format:
   * [
   *   {centroid: [-122.4, 37.7], value: 0.2},
   *   ...
   * ]
   */
  export default function ColumnBaseLayer({data, opacity}){
      
    return new ColumnLayer({
        id: data.id,
        data: data.data,
        diskResolution: data.properties.resolution || 12,
        radius: data.properties.radius || 30,
        extruded: data.properties.extruded || true,
        pickable: data.properties.pickable || true,
        elevationScale: data.properties.elevationScale || 1,
        getPosition: d => d.centroid,
        getFillColor: d => [48, 128, d.value * 255, 255],
        getLineColor: [0, 0, 0],
        getElevation: d => d.value,
        opacity
      });
          
    
  }
