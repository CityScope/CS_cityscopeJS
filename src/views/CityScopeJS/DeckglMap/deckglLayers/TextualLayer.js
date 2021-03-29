import { TextLayer } from "@deck.gl/layers";

export default function TextualLayer({ data, coordinates }) {
    /*
     * this layer takes textual layer procuded by a 3rd party
     * module, and renders a text message near the grid cell
     * defined in the data id attribute.
     *
     * data format:
     * [
     * {id: 450, info: 'yes!' }
     * ]
     *
     * coordinates format:
     * [
     *   {info: 'Colma (COLM)', coordinates: [-122.466233, 37.684638]},
     *   ...
     * ]
     */

    if (data && coordinates && coordinates.features) {
        console.log(coordinates.features);

        let textLayerData = [];

        data.forEach((infoIteam) => {
            console.log(coordinates.features[infoIteam.id]);

            textLayerData.push({
                coordinates: [
                    coordinates.features[infoIteam.id].geometry
                        .coordinates[0][0][0],
                    coordinates.features[infoIteam.id].geometry
                        .coordinates[0][0][1],
                    100,
                ],
                info: infoIteam.info,
            });
        });

        return new TextLayer({
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
