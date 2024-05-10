import {TextLayer} from '@deck.gl/layers';
/**
   * Data format:
   * [
   *   {name: 'Colma (COLM)', address: '365 D Street, Colma CA 94014', coordinates: [-122.466233, 37.684638]},
   *   ...
   * ]
   */
  export default function TextBaseLayer({data, opacity}){

    return new TextLayer({
          id: data.id,
          data: data.data,
          pickable: data.properties.pickable || true,
          getPosition: d => [d.coordinates[0],d.coordinates[1],20],
          getText: d => d.text,
          getAngle: 0,
          getTextAnchor: 'middle',
          getAlignmentBaseline: 'center',
          background: true,
          backgroundPadding: [3,3,3,3],
          getBackgroundColor: [255, 255, 255, 200],
          getBorderWidth: 1,
          billboard: true,
          getSize: 5,
          sizeScale: 2,
          opacity
        });
      
    
  }
