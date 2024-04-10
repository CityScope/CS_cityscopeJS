import {GridCellLayer} from '@deck.gl/layers';

  /**
   * Data format:
   * [
   *   {centroid: [-122.4, 37.7],
   *  value: 100},
   *   ...
   * ]
   */
  export default function GridCellBaseLayer({data, opacity}){
    if(data.gridcell){
        return new GridCellLayer({
          id: 'grid-cell-layer',
          data: data.gridcell.data,
          pickable: data.gridcell.properties.pickable || true,
          extruded: data.gridcell.properties.extruded || true,
          cellSize: data.gridcell.properties.cellSize || 200,
          elevationScale: data.gridcell.properties.elevationScale || 5000,
          getPosition: d => d.centroid,
          getFillColor: d => [48, 128, d.value * 255, 255],
          getElevation: d => d.value,
          opacity
        });    
    }
  }
