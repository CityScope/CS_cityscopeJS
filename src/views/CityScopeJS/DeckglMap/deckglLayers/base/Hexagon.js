import {HexagonLayer} from '@deck.gl/aggregation-layers';

  /**
   * Data format:
   * [
   *   {coordinates: [-122.42177834, 37.78346622]},
   *   ...
   * ]
   */
  export default function HexagonBaseLayer({data, opacity}){

    return new HexagonLayer({
          id: data.id,
          data: data.data,
          pickable: data.properties.pickable || true,
          extruded: data.properties.extruded || true,
          radius: data.properties.radius || 200,
          elevationScale: data.properties.elevationScale || 4,
          getPosition: d => d.coordinates,
          opacity
        });
    
  }
