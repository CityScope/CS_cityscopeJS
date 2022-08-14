import {

  AmbientLight,
  _SunLight as SunLight,
} from "@deck.gl/core";

export const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});

export const dirLight = new SunLight({
  timestamp: Date.UTC(2019, 7, 1, 9),
  color: [255, 255, 255],
  intensity: 1.0,
  _shadow: true,
});
