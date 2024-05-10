import {ScatterplotLayer} from '@deck.gl/layers';

  /**
   * Data format:
   * [
   *   {name: 'Colma (COLM)', address: '365 D Street, Colma CA 94014', exits: 4214, coordinates: [-122.466233, 37.684638]},
   *   ...
   * ]
   */
  export default function ScatterplotBaseLayer({data, opacity}){

    return new ScatterplotLayer({
          id: data.id,
          data: data.data,
          pickable: data.path.properties.pickable || true,
          stroked: data.path.properties.stroked || true,
          filled: data.path.properties.filled || true,
          radiusScale: data.path.properties.radiusScale || 6,
          radiusMinPixels: data.path.properties.radiusMinPixels || 1,
          radiusMaxPixels: data.path.properties.radiusMaxPixels || 100,
          lineWidthMinPixels: data.path.properties.lineWidthMinPixels || 1,
          getPosition: d => d.coordinates,
          getRadius: d => Math.sqrt(d.exits),
          getFillColor: d => [255, 140, 0],
          getLineColor: d => [0, 0, 0],
          opacity
        });
      
  }
