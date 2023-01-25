import { GeoJsonLayer } from "@deck.gl/layers";
import { numberToColorHsl } from "../../../../utils/utils";

export default function TrafficLayer({ data, opacity }) {
  if (data.traffic) {
    // create a new geojson object from `data.traffic`
    // where each feature is a rectangular polygon with the coordinates of the
    // line and the height of that feature `properties.norm_traffic` attribute.
    let newGeoJson = {
      type: "FeatureCollection",
      features: data.traffic.features.map((feature) => {
        let newFeature = {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates:
              // offset the line coordinates by the width of norm_traffic in meters
              // to create a rectangular polygon and then add the height of the norm_traffic
              // to the coordinates to create a 3D polygon
              [
                [
                  [
                    feature.geometry.coordinates[0][0] -
                      (feature.properties.lanes / 75000) ,
                    feature.geometry.coordinates[0][1] -
                      (feature.properties.lanes / 75000) ,
                    0,
                  ],
                  [
                    feature.geometry.coordinates[0][0] +
                      (feature.properties.lanes / 75000) ,
                    feature.geometry.coordinates[0][1] +
                      (feature.properties.lanes / 75000) ,
                    0,
                  ],
                  [
                    feature.geometry.coordinates[1][0] +
                      (feature.properties.lanes / 75000) ,
                    feature.geometry.coordinates[1][1] +
                      (feature.properties.lanes / 75000) ,
                    0,
                  ],
                  [
                    feature.geometry.coordinates[1][0] -
                      (feature.properties.lanes / 75000) ,
                    feature.geometry.coordinates[1][1] -
                      (feature.properties.lanes / 75000) ,
                    0,
                  ],
                ],
              ],
          },
          properties: {
            norm_traffic: feature.properties.norm_traffic,
          },
        };
        return newFeature;
      }),
    };

    return new GeoJsonLayer({
      id: "TRAFFIC_TRIPS",
      shadowEnabled: false,
      data: newGeoJson,
      pickable: true,
      filled: true,
      extruded: true,

      getFillColor: (d) => {
        const selectedWeight = (w) => {
          if (w > 0 && w < 1) {
            return w;
          } else if (w >= 1) {
            return 1;
          } else {
            return 0;
          }
        };

        const rgb = numberToColorHsl(
          selectedWeight(1 - d.properties.norm_traffic),
          0,
          1
        );
        return [rgb[0], rgb[1], rgb[2], 225 * opacity];
      },

      getElevation: (d) => d.properties.norm_traffic * 500 * opacity,

      updateTriggers: {
        getLineColor: data,
        getLineWidth: opacity,
      },
    });
  }
}
