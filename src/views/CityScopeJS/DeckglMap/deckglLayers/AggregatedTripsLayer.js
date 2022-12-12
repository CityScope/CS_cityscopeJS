import { ArcLayer } from "@deck.gl/layers";
import { hexToRgb } from "../../../../utils/utils";

export default function AggregatedTripsLayer({ data, selected, opacity }) {
  if (data.ABM2 && selected) {
    const attrGroup = selected.mode && selected.mode ? "mode" : "profile";

    return new ArcLayer({
      id: "AGGREGATED_TRIPS",
      shadowEnabled: false,
      data: data.ABM2.trips,
      // on each trip in data.ABM2.trips get the first coordinate of the path for getSourcePosition

      getSourcePosition: (d) => {
        if (selected[attrGroup] === d[attrGroup]) {
          return d.path[0];
        }
      },
      // on each trip in data.ABM2.trips get the last coordinate of the path for getTargetPosition
      getTargetPosition: (d) => {
        if (selected[attrGroup] === d[attrGroup]) {
          return d.path[d.path.length - 1];
        }
      },
      getSourceColor: (d) => {
        // ! BUGGY - the color is not changing appropriately when the selected mode changes
        return hexToRgb(data.ABM2.attr[attrGroup][d[attrGroup]].color);
      },
      getTargetColor: [0, 0, 0, 150],

      // opacity: 0.85,
      getWidth: 5 * opacity,

      updateTriggers: {
        getSourcePosition: selected,
        getTargetPosition: selected,
      },
    });
  }
}
