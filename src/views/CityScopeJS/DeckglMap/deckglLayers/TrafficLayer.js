// import { PathLayer } from "@deck.gl/layers";
import { GeoJsonLayer } from "@deck.gl/layers";

import { numberToColorHsl } from "../../../../utils/utils";

let x = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-67.13734, 45.13745],
        [-66.96466, 44.8097],
        [-68.03252, 44.3252],
        [-69.06, 43.98],
      ],
    ],
  },
};

export default function TrafficLayer({ data, opacity }) {
  if (data.traffic) {
    return new GeoJsonLayer({
      id: "TRAFFIC_TRIPS",
      shadowEnabled: false,
      data: data.traffic,
      id: "line-layer",
      pickable: true,
      stroked: false,
      filled: true,
      extruded: true,
      pointType: "circle",
      lineWidthScale: 1,
      lineWidthMinPixels: 0.5,

      getLineColor: (d) => {
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
        return [rgb[0], rgb[1], rgb[2], 200];
      },
      getLineWidth: (d) => d.properties.norm_traffic * 100 * opacity,
      getElevation: (d) => d.properties.norm_traffic * 5000 * opacity,

      updateTriggers: {
        getLineColor: data,
        getLineWidth: opacity,
      },
    });
  }
}

// export default function TrafficLayer({ data, opacity }) {
//   if (data.traffic) {
//     return new PathLayer({
//       id: "TRAFFIC_TRIPS",
//       shadowEnabled: false,
//       data: data.traffic.features,

//       id: "line-layer",

//       getColor: (d) => {
//         const selectedWeight = (w) => {
//           if (w > 0 && w < 1) {
//             return w;
//           } else if (w >= 1) {
//             return 1;
//           } else {
//             return 0;
//           }
//         };

//         const rgb = numberToColorHsl(
//           selectedWeight(1 - d.properties.norm_traffic),
//           0,
//           1
//         );
//         return [rgb[0], rgb[1], rgb[2], 200];
//       },
//       getWidth: (d) => d.properties.norm_traffic * 100 * opacity,
//       getPath: (d) => [
//         [
//           d.geometry.coordinates[0][0],
//           d.geometry.coordinates[0][1],
//           d.properties.norm_traffic * 500 * opacity,
//         ],
//         [
//           d.geometry.coordinates[1][0],
//           d.geometry.coordinates[1][1],
//           d.properties.norm_traffic * 500 * opacity,
//         ],
//       ],

//       updateTriggers: {
//         getColor: data,
//         getWidth: opacity,
//         getPath: opacity,
//       },
//     });
//   }
// }
