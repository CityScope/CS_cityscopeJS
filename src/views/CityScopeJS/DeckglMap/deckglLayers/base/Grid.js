import {GridLayer} from '@deck.gl/aggregation-layers';

  /**
   * Data format:
   * [
   *   {coordinates: [-122.42177834, 37.78346622]},
   *   ...
   * ]
   */
  export default function GridBaseLayer({data, opacity}){

    return new GridLayer({
          id: data.id,
          data: data.data,
          pickable: data.properties.pickable || true,
          extruded: data.properties.extruded || true,
          cellSize: data.properties.cellSize || 200,
          elevationScale: data.properties.elevationScale || 4,
          getPosition: d => d.coordinates,
          opacity
        });
          
    
  }
