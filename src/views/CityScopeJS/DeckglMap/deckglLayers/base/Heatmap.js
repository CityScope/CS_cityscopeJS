import {HeatmapLayer} from '@deck.gl/aggregation-layers';

  /**
   * Data format:
   * [
   *   {coordinates: [-122.42177834, 37.78346622], weight: 10},
   *   ...
   * ]
   */
  export default function HeatmapBaseLayer({data, opacity}){

    if(data.heatmap){

        return new HeatmapLayer({
            id: 'heatmapLayer',
            data: data.heatmap.data,
            getPosition: d => d.coordinates,
            getWeight: d => d.weight,
            aggregation: 'SUM',
            opacity
          });
    }
  }
