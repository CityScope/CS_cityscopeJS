import { TripsLayer } from "@deck.gl/geo-layers";
import { hexToRgb } from "../utils/BaseMapUtils";

//  * remap line width
const _remapValues = (value) => {
    let remap =
        value > 15 && value < 25 ? 3 : value < 15 && value > 10 ? 12 : 30;
    return remap;
};

export default function ABMLayer({
    data,
    cityioData,
    ABMmode,
    zoomLevel,
    sliders,
}) {
    return new TripsLayer({
        id: "ABM",
        data,
        getPath: (d) => d.path,
        getTimestamps: (d) => d.timestamps,
        getColor: (d) => {
            let col = hexToRgb(cityioData.ABM2.attr[ABMmode][d[ABMmode]].color);
            return col;
        },

        getWidth: 1,
        widthScale: _remapValues(zoomLevel),
        opacity: 0.8,
        rounded: true,
        trailLength: 500,
        currentTime: sliders.time[1],

        updateTriggers: {
            getColor: ABMmode,
        },
        transitions: {
            getColor: 500,
        },
    });
}
