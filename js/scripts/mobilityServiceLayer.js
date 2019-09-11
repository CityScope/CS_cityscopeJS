import "./Storage";
import { Deck } from "@deck.gl/core";
import { MapboxLayer } from "@deck.gl/mapbox";
import { TripsLayer } from "@deck.gl/geo-layers";

export function mobilityServiceLayer() {
  // https://github.com/uber/deck.gl/blob/master/docs/api-reference/mapbox/mapbox-layer.md
  // https://github.com/uber/deck.gl/blob/master/docs/api-reference/mapbox/overview.md?source=post_page---------------------------#using-with-pure-js

  const DATA_URL = {
    TRIPS: "https://cityio.media.mit.edu/api/table/grasbrook/trips",
    GAMA: "https://cityio.media.mit.edu/api/table/grasbrook/cityIO_Gama_Hamburg"
  };

  let timeStampDiv = document.getElementById("timeStamp");
  let simPaceDiv = document.getElementById("simPaceDiv");

  const deckContext = new Deck({
    gl: Storage.map.painter.context.gl,
    layers: []
  });

  let time = 0;
  // a day in sec
  let loopLength = 86400;
  let simPaceValue = 1;

  var mobilitySlider = document.getElementById("mobilitySlider");
  var simPaceSlider = document.getElementById("simPaceSlider");

  mobilitySlider.addEventListener("input", function() {
    time = (mobilitySlider.value / 100) * loopLength;
  });

  simPaceSlider.addEventListener("input", function() {
    simPaceValue = simPaceSlider.value / 100;
  });

  // https://github.com/uber/deck.gl/blob/master/docs/api-reference/mapbox/mapbox-layer.md
  function renderLayers() {
    if (time >= loopLength - 1) {
      time = 0;
    } else {
      time = time + simPaceValue;
    }

    deckContext.setProps({
      layers: [
        new TripsLayer({
          id: "ABMLayer",
          data: DATA_URL.GAMA,
          getPath: d => d.segments,
          getColor: d => {
            switch (d.mode) {
              case 0:
                return [255, 0, 255];
              case 1:
                return [60, 128, 255];
              case 2:
                return [153, 255, 51];
              case 3:
                return [153, 180, 100];
            }
          },

          opacity: 0.4,
          widthMinPixels: 3,
          trailLength: 3000,
          currentTime: time,
          rounded: true
        }),
        new TripsLayer({
          id: "mobilityLayer",
          data: DATA_URL.TRIPS,
          getPath: d => d.segments,
          getColor: d => {
            switch (d.mode) {
              case 0:
                return [255, 0, 255];
              case 1:
                return [60, 128, 255];
              case 2:
                return [153, 255, 51];
              case 3:
                return [153, 180, 100];
            }
          },
          opacity: 0.3,
          widthMinPixels: 2,
          trailLength: 50,
          currentTime: time,
          rounded: true
        })
      ]
    });

    var dateObject = new Date(null);
    dateObject.setSeconds(time); // specify value for SECONDS here
    var timeString = dateObject.toISOString().substr(11, 8);
    timeStampDiv.innerHTML = "time: " + timeString;
    simPaceDiv.innerHTML = "Simulation pace: " + simPaceValue;
  }

  // start animation loop
  setInterval(() => {
    renderLayers();
  });

  Storage.map.addLayer(
    new MapboxLayer({ id: ["mobilityLayer", "ABMLayer"], deck: deckContext })
  );
}
