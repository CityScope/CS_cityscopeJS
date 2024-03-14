import {ArcLayer} from '@deck.gl/layers';

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
  export default function ArcBaseLayer({data, opacity}){
    if(data.arc){
        return new ArcLayer({
          id: 'arc-layer',
          data: data.arc.data,
          pickable: true,
          getWidth: data.arc.properties.width || 12,
          getSourcePosition: d => d.from.coordinates,
          getTargetPosition: d => d.to.coordinates,
          getSourceColor: d => d.sourceColor || [255, 140, 0],
          getTargetColor: d => d.targetColor || [55, 140, 0],
          opacity
        });
      
    }
  }
