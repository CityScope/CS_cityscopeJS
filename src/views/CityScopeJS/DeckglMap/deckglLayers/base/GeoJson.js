import {GeoJsonLayer} from '@deck.gl/layers';

/**
 * Data format:
 * Valid GeoJSON object
 */

export default function GeoJsonBaseLayer({data, opacity}){
  if(data){
      return new GeoJsonLayer({
        id: data.id,
        data: data.data,
        opacity: opacity || 0.5,
        pickable: data.properties?.pickable || true,
        stroked: data.properties?.stroked || false,
        filled: data.properties?.filled || true,
        extruded: data.properties?.extruded || true,
        wireframe: data.properties?.wireframe || false,
        pointType: data.properties?.pointType || 'circle',
        autoHighlight: data.properties?.autoHighlight || true,
        highlightColor: data.properties?.highlightColor || [242, 0, 117, 120],
        lineWidthUnits: data.properties?.lineWidthUnits || 'pixels',
        lineWidthMinPixels: data.properties?.lineWidthMinPixels || 1,
        getFillColor: d => d.properties?.color || data.properties?.color ||  [160, 160, 180, 200],
        getLineColor: d => d.properties?.lineColor || data.properties?.lineColor || [255, 255, 255],
        getPointRadius: d =>   d.properties?.pointRadius || data.properties?.pointRadius || 10,
        getLineWidth: d => d.properties?.lineWidth ||data.properties?.lineWidth ||  1,
        getElevation: d => d.properties?.height || data.properties?.height || 1,
        updateTriggers: {
          getFillColor: data,
          getLineColor: data,
          getPointRadius: data,
          getLineWidth: data,
          getElevation: data,
        },
        transitions: {
          getFillColor: data.properties?.duration || 500,
          getElevation: data.properties?.duration || 500,
          getLineWidth: data.properties?.duration || 500,
          getPointRadius: data.properties?.duration || 500,
          getLineColor: data.properties?.duration || 500,
        }
      });
    
    
  }
}