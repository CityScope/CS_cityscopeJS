import {ContourLayer} from '@deck.gl/aggregation-layers';

/**
   * Data format:
   * [
   *   {coordinates: [-122.42177834, 37.78346622]},
   *   ...
   * ]
   */
export default function ContourBaseLayer({data, opacity}){
    if(data.contours){
        return new ContourLayer({
          id: 'contourLayer',
          contours: data.contours.data,
          cellSize: data.contours.properties.cellSize || 200,
          getPosition: d => d.coordinates,
          opacity
        });
      
    }
  }
