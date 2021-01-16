import { PathLayer } from "deck.gl";
import { hexToRgb } from "../utils/BaseMapUtils";

export default function AggregatedTripsLayer({ data, cityioData, ABMmode }) {
    return new PathLayer({
        id: "AGGREGATED_TRIPS",
        _shadow: false,
        data,
        getPath: (d) => {
            const noisePath =
                Math.random() < 0.5
                    ? Math.random() * 0.00005
                    : Math.random() * -0.00005;
            for (let i in d.path) {
                d.path[i][0] = d.path[i][0] + noisePath;
                d.path[i][1] = d.path[i][1] + noisePath;
                d.path[i][2] = d.mode[0] * 2;
            }
            return d.path;
        },
        getColor: (d) => {
            let col = hexToRgb(cityioData.ABM2.attr[ABMmode][d[ABMmode]].color);
            return col;
        },
        opacity: 0.2,
        getWidth: 1.5,

        updateTriggers: {
            getColor: ABMmode,
        },
        transitions: {
            getColor: 500,
        },
    });
}
