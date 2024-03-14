import {ColumnLayer} from '@deck.gl/layers';

  /**
   * Data format:
   * [
   *   {centroid: [-122.4, 37.7], value: 0.2},
   *   ...
   * ]
   */
  export default function ColumnBaseLayer({data, opacity}){
    if(data.column){
      return new ColumnLayer({
        id: 'column-layer',
        data: data.column.data,
        diskResolution: data.column.properties.resolution || 12,
        radius: data.column.properties.radius || 30,
        extruded: data.column.properties.extruded || true,
        pickable: data.column.properties.pickable || true,
        elevationScale: data.column.properties.elevationScale || 1,
        getPosition: d => d.centroid,
        getFillColor: d => [48, 128, d.value * 255, 255],
        getLineColor: [0, 0, 0],
        getElevation: d => d.value,
        opacity
      });
          
    }
  }
