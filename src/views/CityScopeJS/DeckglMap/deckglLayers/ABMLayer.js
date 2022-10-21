import { TripsLayer } from "@deck.gl/geo-layers";
import { hexToRgb } from "../../../../utils/utils";



export default function ABMLayer({ data, ABMmode,  time, opacity }) {
  if (data.ABM2) {
    return new TripsLayer({
      // opacity,
      id: "ABM",
      data: data.ABM2.trips,
      getPath: (d) => d.path,
      getTimestamps: (d) => d.timestamps,
      getColor: (d) => hexToRgb(data.ABM2.attr.mode[d.mode].color),
      shadowEnabled: false,
      getWidth: 1,
      widthScale: opacity,
      trailLength: 500,
      currentTime: time,

      updateTriggers: {
        getColor: ABMmode,
      },
      transitions: {
        getColor: 500,
      },
    });
  }
}
