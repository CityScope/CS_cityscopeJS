import {H3HexagonLayer} from '@deck.gl/geo-layers';
/**
   * Data format:
   * 
      {
        "color": [R,G,B],
        "hexIds": [
          "88283082b9fffff",
          "88283082b1fffff",
          "88283082b5fffff",
          "88283082b7fffff",
          "88283082bbfffff",
          "882830876dfffff"
        ]
      },
      {
   * ]
   */
  export default function H3HexagonBaseLayer({data, opacity}){
    
    return new H3HexagonLayer({
          id: data.id,
          data: data.data,
          pickable: data.properties.pickable || true,
          extruded: data.properties.extruded || true,
          getHexagon: d => d.hex,
          getFillColor: d => d.color || [255, (1 - d.elevation / 500) * 255, 0],
          getElevation: d => d.elevation,
          elevationScale: data.properties.elevationScale || 20,
          opacity
        });
      
    
  }
