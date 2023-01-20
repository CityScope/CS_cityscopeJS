import axios from "axios";
import { cityIOSettings } from "../settings/settings";

/**
 * Get API call using axios
 */

export const getAPICall = async (URL) => {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

/**
 * convert rgb to hex
 */
export function rgbToHex(r, g, b) {
  function valToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }
  return "#" + valToHex(r) + valToHex(g) + valToHex(b);
}

/**
 * convert hex to rgb array
 */
export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}

/**
 *
 * @param {string} hexString test if vaild 3->6 HEX color
 */
export const testHex = (hexString) => {
  let isHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(hexString);
  return isHex;
};

/**
 * checks if edits are done (toggled off)
 * than returns a redux state
 * with grid edits payload
 */
export const postToCityIO = (data, tableName, endPoint) => {
  let postURL = cityIOSettings.cityIO.baseURL + "table/" + tableName + endPoint;

  const options = {
    method: "post",
    url: postURL,
    data: data,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  axios(options)
    .then((res) => {
      if (res.data.status === "ok") {
        console.log(`--> cityIO endpoint ${postURL} was updated <--`);
      }
    })
    .catch((error) => {
      console.log("ERROR:", error);
    });
};

const cityIObaseURL = cityIOSettings.cityIO.baseURL;

export const fetchJSON = async (url, options) => {
  const response = await fetch(url, options);
  const data = await response.json();
  return data;
};

export const getTablePrevCommitHash = async (id) =>
  await fetchJSON(`${cityIObaseURL}commit/${id}/`).then((c) => {
    return { parent: c.parent, meta: c };
  });

export const getTableID = async (tableName) =>
  await fetchJSON(
    `${cityIObaseURL}table/${tableName}/meta/hashes/GEOGRIDDATA/`
  );

export const getCommit = async (id) =>
  await fetchJSON(`${cityIObaseURL}commit/${id}/`);

export const getModule = async (id) =>
  await fetchJSON(`${cityIObaseURL}module/${id}/`);

/**
 * Compute the middle of the grid and return the coordinates
 */

export const computeMidGridCell = (cityIOdata) => {
  const lastCell =
    cityIOdata?.GEOGRID?.features[cityIOdata?.GEOGRID?.features?.length - 1]
      ?.geometry?.coordinates[0][0];
  const firstCell =
    cityIOdata?.GEOGRID?.features[0]?.geometry?.coordinates[0][0];
  const midGrid = [
    (firstCell[0] + lastCell[0]) / 2,
    (firstCell[1] + lastCell[1]) / 2,
  ];
  return midGrid;
};

/**
 * ! http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
 *
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
export function hslToRgb(h, s, l) {
  var r, g, b;

  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
}

export function numberToColorHsl(i, min, max) {
  var ratio = i;
  if (min > 0 || max < 1) {
    if (i < min) {
      ratio = 0;
    } else if (i > max) {
      ratio = 1;
    } else {
      var range = max - min;
      ratio = (i - min) / range;
    }
  }
  // as the function expects a value between 0 and 1, and red = 0° and green = 120°
  // we convert the input to the appropriate hue value
  var hue = (ratio * 1.2) / 3.6;
  // we convert hsl to rgb (saturation 100%, lightness 50%)
  var rgb = hslToRgb(hue, 1, 0.5);

  // we format to css value and return
  return [rgb[0], rgb[1], rgb[2]];
}
