import "./Storage";
import { Deck } from "@deck.gl/core";
import { MapboxLayer } from "@deck.gl/mapbox";
import { TripsLayer } from "@deck.gl/geo-layers";
 import { getCityIO } from "./update";



export async function mobilityServiceLayer() {
  // https://github.com/uber/deck.gl/blob/master/docs/api-reference/mapbox/mapbox-layer.md
  // https://github.com/uber/deck.gl/blob/master/docs/api-reference/mapbox/overview.md?source=post_page---------------------------#using-with-pure-js

  const DATA_URL = {
    GAMA: "https://cityio.media.mit.edu/api/table/grasbrook/gama"
  };

  let gamaData = await getCityIO(DATA_URL.GAMA);
  gamaData = gamaData[0];
  gamaData = "https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/trips-v7.json"

  //
  let timeStampDiv = document.getElementById("timeStamp");
  let simPaceDiv = document.getElementById("simPaceDiv");
  //
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
          data: 
           gamaData,
          getPath: d => d.path,
          getTimestamps: d => d.timestamps,
          getColor: d => (d.vendor === 0 ? [255, 0, 255] : [0, 255, 255]),
          opacity: 0.3,
          widthMinPixels: 2,
          rounded: true,
          trailLength: 50,
          currentTime: time

          // id: "ABMLayer",
          // data: DATA_URL.GAMA,
          // getPath: d => d.path,
          // getTimestamps: d =>
          // d.segments[3],
          //   d.path.map(p => p.timestamp),
          // getColor: d => {
          //   switch (d.mode) {
          //     case 0:
          //       return [255, 0, 255];
          //     case 1:
          //       return [60, 128, 255];
          //     case 2:
          //       return [153, 255, 51];
          //     case 3:
          //       return [153, 180, 100];
          //   }
          // },
          //     opacity: 0.4,
          //     widthMinPixels: 3,
          //     trailLength: 3000,
          //     currentTime: time,
          //     rounded: true
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
    renderLayers();
  });

  Storage.map.addLayer(
    new MapboxLayer({ id: ["ABMLayer"], deck: deckContext })
  );
}
