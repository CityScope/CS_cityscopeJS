import {GridLayer} from '@deck.gl/aggregation-layers';

  /**
   * Data format:
   * [
   *   {coordinates: [-122.42177834, 37.78346622]},
   *   ...
   * ]
   */
  export default function GridBaseLayer({data, opacity}){
    if(data.gridlayer){
        return new GridLayer({
          id: 'new-grid-layer',
          data: data.gridlayer.data,
          pickable: data.gridlayer.properties.pickable || true,
          extruded: data.gridlayer.properties.extruded || true,
          cellSize: data.gridlayer.properties.cellSize || 200,
          elevationScale: data.gridlayer.properties.elevationScale || 4,
          getPosition: d => d.coordinates,
          opacity
        });
          
    }
  }
