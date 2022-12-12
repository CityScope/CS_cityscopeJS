// import { TripsLayer } from "@deck.gl/geo-layers";
import { hexToRgb } from "../../../../utils/utils";
import { PathLayer } from "@deck.gl/layers";

export default function ABMLayer({ data, selected, opacity }) {
  if (data.ABM2 && selected) {
    const attrGroup = selected.mode && selected.mode ? "mode" : "profile";
    return new PathLayer({
      id: "ABM",
      shadowEnabled: false,
      data: data.ABM2.trips,
      getPath: (d) => {
        if (selected[attrGroup] === d[attrGroup]) {
          return d.path;
        }
      },
      getColor: (d) => hexToRgb(data.ABM2.attr[attrGroup][d[attrGroup]].color),

      opacity: opacity / 100,
      getWidth: (d) => {
        //! FOR NOW:  return the length of the timeStamps array
        let len = d.path.length ? d.path.length : 1;
        if (len > 30) {
          len = 30 + opacity 
        }
        return len;
      },
      updateTriggers: {
        getPath: selected,
        getWidth: opacity,
      },
    });
  }
}
