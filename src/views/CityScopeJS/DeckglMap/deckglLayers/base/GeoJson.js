import {GeoJsonLayer} from '@deck.gl/layers';

  /**
   * Data format:
   * Valid GeoJSON object
   */
  export default function GeoJsonBaseLayer({data, opacity}){

    return new GeoJsonLayer({
          id: data.id,
          data: data.data,
          pickable: data.properties.pickable || true,
          stroked: data.properties.stroked || false,
          filled: data.properties.filled || true,
          extruded: data.properties.extruded || true,
          pointType: data.properties.pointType || 'circle',
          lineWidthScale: data.properties.lineWidthScale || 20,
          lineWidthMinPixels: data.properties.lineWidthMinPixels || 2,
          getFillColor: [160, 160, 180, 200],
          getLineColor: d => d.properties.color,
          getPointRadius: data.properties.pointRadius || 100,
          getLineWidth: data.properties.lineWidth || 1,
          getElevation: data.properties.elevation || 30,
          opacity
        });
      
      
    
  }
