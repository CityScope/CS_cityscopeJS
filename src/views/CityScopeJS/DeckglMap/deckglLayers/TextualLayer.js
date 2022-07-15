import { TextLayer } from "@deck.gl/layers";

export default function TextualLayer({ data, coordinates, opacity }) {
  if (data.text && coordinates && coordinates.features) {
    /*
     * this layer takes textual layer procured by a 3rd party
     * module, and renders a text message near the grid cell
     * defined in the data id attribute.
     *
     * data format:
      [
      {"id": 0, "info": "yes!" },   {"id": 10, "info": "I'm on ID 10!" }
      ]
     *
     * coordinates format:
     [
       {"info": "yes!", coordinates: [-122.466233, 37.684638]},
     ]
     */

    let textLayerData = [];

    data.text.forEach((infoIteam) => {
      textLayerData.push({
        coordinates: [
          coordinates.features[infoIteam.id].geometry.coordinates[0][0][0],
          coordinates.features[infoIteam.id].geometry.coordinates[0][0][1],
          100,
        ],
        info: infoIteam.info,
      });
    });

    return new TextLayer({
      opacity,
      id: "text-layer",
      data: textLayerData,
      pickable: true,
      getPosition: (d) => d.coordinates,
      getText: (d) => d.info,
      getColor: [255, 255, 255],
      getSize: 30,
      getAngle: 0,
      getTextAnchor: "middle",
      getAlignmentBaseline: "center",
    });
  }
}
