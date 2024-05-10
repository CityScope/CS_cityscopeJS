import {ContourLayer} from '@deck.gl/aggregation-layers';

/**
   * Data format:
   * [
   *   {coordinates: [-122.42177834, 37.78346622]},
   *   ...
   * ]
   */
export default function ContourBaseLayer({data, opacity}){

  return new ContourLayer({
          id: data.id,
          contours: data.data,
          cellSize: data.properties.cellSize || 200,
          getPosition: d => d.coordinates,
          opacity
        });
      
    
  }
