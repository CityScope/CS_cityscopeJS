import {GridCellLayer} from '@deck.gl/layers';

  /**
   * Data format:
   * [
   *   {centroid: [-122.4, 37.7],
   *  value: 100},
   *   ...
   * ]
   */
  export default function GridCellBaseLayer({data, opacity}){

    return new GridCellLayer({
          id: data.id,
          data: data.data,
          pickable: data.properties.pickable || true,
          extruded: data.properties.extruded || true,
          cellSize: data.properties.cellSize || 200,
          elevationScale: data.properties.elevationScale || 5000,
          getPosition: d => d.centroid,
          getFillColor: d => [48, 128, d.value * 255, 255],
          getElevation: d => d.value,
          opacity
        });    
    
  }
