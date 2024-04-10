import {HexagonLayer} from '@deck.gl/aggregation-layers';

  /**
   * Data format:
   * [
   *   {coordinates: [-122.42177834, 37.78346622]},
   *   ...
   * ]
   */
  export default function HexagonBaseLayer({data, opacity}){
    if(data.hexagon){
        return new HexagonLayer({
          id: 'hexagon-layer',
          data: data.hexagon.data,
          pickable: data.hexagon.properties.pickable || true,
          extruded: data.hexagon.properties.extruded || true,
          radius: data.hexagon.properties.radius || 200,
          elevationScale: data.hexagon.properties.elevationScale || 4,
          getPosition: d => d.coordinates,
          opacity
        });
    }
  }
