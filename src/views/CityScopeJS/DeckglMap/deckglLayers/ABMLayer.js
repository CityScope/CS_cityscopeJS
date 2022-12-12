// import { TripsLayer } from "@deck.gl/geo-layers";
import { hexToRgb } from "../../../../utils/utils";
import { PathLayer } from "@deck.gl/layers";

export default function ABMLayer({ data, selected, opacity }) {
  if (data.ABM2 && selected) {
    // check if the selected mode is a mode or a profile
    const attrGroup = "mode" in selected ? "mode" : "profile";
    // return new TripsLayer
    return new PathLayer({
      id: "ABM",
      shadowEnabled: false,
      data: data.ABM2.trips,
      // on each trip in data.ABM2.trips get the path for getPath
      // if the selected mode is the same as the trip's mode
      getPath: (d) => {
        if (selected[attrGroup] === d[attrGroup]) {
          return d.path;
        }
      },
      // get the color of the trip from the data.ABM2.attr object
      getColor: (d) => hexToRgb(data.ABM2.attr[attrGroup][d[attrGroup]].color),

      opacity: opacity / 100,
      getWidth: (d) => {
        //! FOR NOW:  return the length of the timeStamps array
        let len = d.path.length ? d.path.length : 1;
        if (len > 30) {
          len = 30 + opacity;
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
