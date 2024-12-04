import {H3ClusterLayer} from '@deck.gl/geo-layers';
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
  export default function H3ClusterBaseLayer({data, opacity}){

    return new H3ClusterLayer({
          id: data.id,
          data: data.data,
          pickable: data.properties.pickable || true,
          getHexagons: d => d.hexIds,
          getFillColor: d => d.color || [255, 255, 0],
          getLineColor: data.properties.getLineColor || [255, 255, 255],
          lineWidthMinPixels: data.properties.lineWidthMinPixels || 2,
          opacity
        });
      
    
  }
