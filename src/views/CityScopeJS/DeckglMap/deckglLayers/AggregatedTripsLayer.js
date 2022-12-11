// import { PathLayer } from "@deck.gl/layers";
// import { hexToRgb } from "../../../../utils/utils";

// export default function AggregatedTripsLayer({ data, selected, opacity }) {
//   return new PathLayer({
//     id: "AGGREGATED_TRIPS",
//     shadowEnabled: false,
//     data: data?.ABM2?.trips,
//     getPath: (d) => {
//       if (d.mode === selected) {
//         return d.path;
//       }
//     },
//     getColor: (d) => hexToRgb(data.ABM2.attr.mode[d.mode].color),

//     opacity,
//     getWidth: 3,

//     updateTriggers: {
//       getPath: selected,
//     },
//   });
// }

import { ArcLayer } from "@deck.gl/layers";
import { hexToRgb } from "../../../../utils/utils";

export default function AggregatedTripsLayer({ data, selected, opacity }) {
  return new ArcLayer({
    id: "AGGREGATED_TRIPS",
    shadowEnabled: false,
    data: data?.ABM2?.trips,
    // on each trip in data.ABM2.trips get the first coordinate of the path for getSourcePosition

    getSourcePosition: (d) => {
      if (d.mode === selected) {
        return d.path[0];
      }
    },
    // on each trip in data.ABM2.trips get the last coordinate of the path for getTargetPosition
    getTargetPosition: (d) => {
      if (d.mode === selected) {
        return d.path[d.path.length - 1];
      }
    },

    getSourceColor: (d) => hexToRgb(data.ABM2.attr.mode[d.mode].color),
    getTargetColor: (d) => hexToRgb(data.ABM2.attr.mode[d.mode].color),

    opacity:0.85,
    getWidth: 2 * opacity,

    updateTriggers: {
      getSourcePosition: selected,
      getTargetPosition: selected,
    },
  });
}
