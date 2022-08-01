import { PathLayer } from "@deck.gl/layers";
import { hexToRgb } from "../../../../utils/utils";

export default function AggregatedTripsLayer({ data, ABMmode, opacity }) {
  if (data.ABM2) {
    return new PathLayer({
      id: "AGGREGATED_TRIPS",
      shadowEnabled: false,
      data: data.ABM2.trips,
      getPath: (d) => d.path,
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
