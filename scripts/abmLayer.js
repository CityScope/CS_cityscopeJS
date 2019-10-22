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
  let startSimHour = 60 * 60 * 7;
  let endSimHour = 60 * 60 * 12;
  let time = startSimHour;
  // a day in sec = 86400;
  let simPaceValue = 5;
  let loopLength = endSimHour - startSimHour;
  var mobilitySlider = document.getElementById("mobilitySlider");
  var simPaceSlider = document.getElementById("simPaceSlider");
  mobilitySlider.addEventListener("input", function() {
    time = startSimHour + (mobilitySlider.value / 100) * loopLength;
  });
  simPaceSlider.addEventListener("input", function() {
    simPaceValue = simPaceSlider.value / 100;
  });

  const deckContext = new Deck({
    gl: Storage.map.painter.context.gl,
    layers: []
  });

  Storage.map.addLayer(
    new MapboxLayer({ id: ["ABMLayer"], deck: deckContext })
  );

  function renderDeck() {
    let ABMmodeType = Storage.ABMmodeType;

    if (time >= startSimHour + loopLength - 1) {
      time = startSimHour;
    } else {
      time = time + simPaceValue;
    }
    // toggle abm layer mode or type
    if (ABMmodeType) {
      deckContext.setProps({
        layers: [
          new TripsLayer({
            id: "ABMLayer",
            data: abmData,
            getPath: d => d.path,
            getTimestamps: d => d.timestamps,
            getColor: d => {
              switch (d.mode[0]) {
                case 0:
                  //purple
                  return [255, 0, 255];
                case 1:
                  //blue
                  return [60, 128, 255];
                case 2:
                  // green
                  return [153, 255, 51];
                case 3:
                  // yellow
                  return [255, 255, 0];
              }
            },
            getWidth: 1,
            rounded: true,
            trailLength: 80,
            currentTime: time
          })
        ]
      });
    } else {
      deckContext.setProps({
        layers: [
          new TripsLayer({
            id: "ABMLayer2",
            data: abmData,
            getPath: d => d.path,
            getTimestamps: d => d.timestamps,
            getColor: d => {
              //switch between modes or types of users
              switch (d.mode[1]) {
                case 0:
                  return [255, 0, 0];
                case 1:
                  return [0, 0, 255];
                case 2:
                  return [0, 255, 0];
              }
            },
            getWidth: 1,
            rounded: true,
            trailLength: 1000,
            currentTime: time
          })
        ]
      });
    }

    // print the time on div
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
}
