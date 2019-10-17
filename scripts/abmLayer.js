// https://github.com/uber/deck.gl/blob/master/docs/api-reference/mapbox/mapbox-layer.md
// https://github.com/uber/deck.gl/blob/master/docs/api-reference/mapbox/overview.md?source=post_page---------------------------#using-with-pure-js

import "./Storage";
import { Deck } from "@deck.gl/core";
import { MapboxLayer } from "@deck.gl/mapbox";
import { TripsLayer } from "@deck.gl/geo-layers";
import { getCityIO } from "./update";

export async function ABMlayer() {
  const DATA_URL = {
    // RONAN ABM: "https://cityio.media.mit.edu/api/table/grasbrook/trips"
    ABM: Storage.cityIOurl + "/ABM"
  };

  let abmData = await getCityIO(DATA_URL.ABM);
  let timeStampDiv = document.getElementById("timeStamp");
  let simPaceDiv = document.getElementById("simPaceDiv");
  const deckContext = new Deck({
    gl: Storage.map.painter.context.gl,
    layers: []
  });

  let sevenAM = 25200;
  let time = sevenAM;
  // a day in sec
  let fullDay = 86400;
  let simPaceValue = 1;
  let loopLength = fullDay - sevenAM * 2;

  var mobilitySlider = document.getElementById("mobilitySlider");
  var simPaceSlider = document.getElementById("simPaceSlider");

  mobilitySlider.addEventListener("input", function() {
    time = (mobilitySlider.value / 100) * loopLength;
  });

  simPaceSlider.addEventListener("input", function() {
    simPaceValue = simPaceSlider.value / 100;
  });

  function renderDeck() {
    if (time >= loopLength - 1) {
      time = sevenAM;
    } else {
      time = time + simPaceValue;
    }

    deckContext.setProps({
      layers: [
        new TripsLayer({
          id: "ABMLayer",
          data: abmData,
          getPath: d => d.path,
          getTimestamps: d => d.timestamps,
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
          widthMinPixels: 5,
          rounded: true,
          trailLength: 10,
          currentTime: time
        })
      ]
    });

    var dateObject = new Date(null);
    dateObject.setSeconds(time); // specify value for SECONDS here
    var timeString = dateObject.toISOString().substr(11, 8);
    timeStampDiv.innerHTML = "time: " + timeString;
    simPaceDiv.innerHTML = "simulation pace x" + simPaceValue;
  }

  // start animation loop
  setInterval(() => {
    renderDeck();
  });

  Storage.map.addLayer(
    new MapboxLayer({ id: ["ABMLayer"], deck: deckContext })
  );
}
