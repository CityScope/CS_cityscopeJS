import {LineLayer} from '@deck.gl/layers';

  /**
   * Data format:
   * [
   *   {
   *     inbound: 72633,
   *     outbound: 74735,
   *     from: {
   *       name: '19th St. Oakland (19TH)',
   *       coordinates: [-122.269029, 37.80787]
   *     },
   *     to: {
   *       name: '12th St. Oakland City Center (12TH)',
   *       coordinates: [-122.271604, 37.803664]
   *   },
   *   ...
   * ]
   */
  export default function LineBaseLayer({data, opacity}){
    if(data.lines){
        return new LineLayer({
          id: 'line-layer',
          data: data.lines.data,
          pickable: data.lines.properties.pickable || true,
          getWidth: data.lines.properties.width || 50,
          getSourcePosition: d => d.from.coordinates,
          getTargetPosition: d => d.to.coordinates,
          getColor: d => d.color || [200, 140, 0],
          opacity
        });
    }
  }
