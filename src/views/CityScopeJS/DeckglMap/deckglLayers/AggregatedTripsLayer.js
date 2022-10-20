import { PathLayer } from "@deck.gl/layers";
import { hexToRgb } from "../../../../utils/utils";

export default function AggregatedTripsLayer({ data, selected, opacity }) {
  return new PathLayer({
    id: "AGGREGATED_TRIPS",
    shadowEnabled: false,
    data: data?.ABM2?.trips,
    getPath: (d) => {
      if (d.mode === selected) {
        return d.path;
      }
    },
    getColor: (d) => hexToRgb(data.ABM2.attr.mode[d.mode].color),

    opacity,
    getWidth: 3,

    updateTriggers: {
      getPath: selected,
    },
  });
}
