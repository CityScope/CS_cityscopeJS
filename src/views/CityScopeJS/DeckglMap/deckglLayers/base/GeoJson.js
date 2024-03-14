import {GeoJsonLayer} from '@deck.gl/layers';

  /**
   * Data format:
   * Valid GeoJSON object
   */
  export default function GeoJsonBaseLayer({data, opacity}){
    if(data.geojsonbase){
        return new GeoJsonLayer({
          id: 'geojson-layer',
          data: data.geojsonbase.data,
          pickable: data.geojsonbase.properties.pickable || true,
          stroked: data.geojsonbase.properties.stroked || false,
          filled: data.geojsonbase.properties.filled || true,
          extruded: data.geojsonbase.properties.extruded || true,
          pointType: data.geojsonbase.properties.pointType || 'circle',
          lineWidthScale: data.geojsonbase.properties.lineWidthScale || 20,
          lineWidthMinPixels: data.geojsonbase.properties.lineWidthMinPixels || 2,
          getFillColor: [160, 160, 180, 200],
          getLineColor: d => d.properties.color,
          getPointRadius: data.geojsonbase.properties.pointRadius || 100,
          getLineWidth: data.geojsonbase.properties.lineWidth || 1,
          getElevation: data.geojsonbase.properties.elevation || 30,
          opacity
        });
      
      
    }
  }
