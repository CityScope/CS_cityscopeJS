import { PathLayer } from "@deck.gl/layers";
import { hexToRgb } from "../../../../utils/utils";

export default function AggregatedTripsLayer({ data, ABMmode, opacity }) {
  if (data.ABM2) {
    return new PathLayer({
      id: "AGGREGATED_TRIPS",
      // shadowEnabled: false,
      data: data.ABM2.trips,
      getPath: (d) => d.path,
      // (d) =>
      //   d.path.map((i) => {
      //     d.path[0] = d.path[i][0] + 0.00005+i;
      //     d.path[1] = d.path[i][1] + 0.00005+ i;
      //   }),

      getColor: (d) => hexToRgb(data.ABM2.attr.mode[d.mode].color),

      opacity,
      getWidth: 5,

      updateTriggers: {
        getColor: ABMmode,
      },
      transitions: {
        getColor: 500,
      },
    });
  }
}
