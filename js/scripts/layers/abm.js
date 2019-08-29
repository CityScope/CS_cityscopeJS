import "../Storage";
import { MapboxLayer } from "@deck.gl/mapbox";
import { Deck } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";

export function abmLayer() {
  const deckContext = new Deck({
    gl: Storage.map.painter.context.gl,
    layers: [
      new ScatterplotLayer({
        id: "scatter",
        data: [{ position: [10.00677491086256, 53.53789434597681], size: 10 }],
        getPosition: d => d.position,
        getRadius: d => d.size,
        getFillColor: [255, 0, 0]
      })
    ]
  });

  // add to mapbox
  Storage.map.addLayer(new MapboxLayer({ id: "scatter", deck: deckContext }));

  // update the layer
  deckContext.setProps({
    layers: [
      new ScatterplotLayer({
        id: "my-scatterplot",
        data: [{ position: [10.00677491086256, 53.53789434597681], size: 100 }],
        getPosition: d => d.position,
        getRadius: d => d.size,
        getFillColor: [0, 0, 255]
      })
    ]
  });
}
