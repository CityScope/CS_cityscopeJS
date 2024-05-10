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
            colorRange: data.properties.colorRange || [[255,255,178],[254,217,118],[254,178,76],[253,141,60],[240,59,32],[189,0,38]],
            opacity
          });
    
  }
