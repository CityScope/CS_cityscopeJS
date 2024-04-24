import {HeatmapLayer} from '@deck.gl/aggregation-layers';

  /**
   * Data format:
   * [
   *   {coordinates: [-122.42177834, 37.78346622], weight: 10},
   *   ...
   * ]
   */
  export default function HeatmapBaseLayer({data, opacity}){

        return new HeatmapLayer({
            id: data.id,
            data: data.data,
            getPosition: d => d.coordinates,
            getWeight: d => d.weight,
            aggregation: 'SUM',
            opacity
          });
    
  }
