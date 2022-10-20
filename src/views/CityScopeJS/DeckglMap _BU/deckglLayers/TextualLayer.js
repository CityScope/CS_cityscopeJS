import { TextLayer } from "@deck.gl/layers";

export default function TextualLayer({ data, coordinates, opacity }) {
  if (!data || !data.text) return;
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

// new TextLayer({
//   id: "text",
//   data: cityIOdata.GEOGRID && cityIOdata.GEOGRID.features,
//   getPosition: (d) => {
//     const pntArr = d.geometry.coordinates[0];
//     const first = pntArr[1];
//     const last = pntArr[pntArr.length - 2];
//     const center = [(first[0] + last[0]) / 2, (first[1] + last[1]) / 2];
//     return center;
//   },

//   getText: (d) => {
//     var length = 10;
//     return d.properties.name.length > length
//       ? d.properties.name.substring(0, length - 3) + "..."
//       : d.properties.name;
//   },
//   getColor: (d) => [0, 0, 0],
//   getSize: 8,
// }),
