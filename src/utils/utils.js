import axios from 'axios'
import settings from '../settings/settings.json'
import { LightingEffect, AmbientLight, _SunLight } from '@deck.gl/core'

/**
 * conver rgb to hex
 */
export function rgbToHex(r, g, b) {
  function valToHex(c) {
    var hex = c.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return '#' + valToHex(r) + valToHex(g) + valToHex(b)
}

/**
 * conver hex to rgb array
 */
export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null
}

/**
 *
 * @param {string} hexString test if vaild 3->6 HEX color
 */
export const testHex = (hexString) => {
  let isHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(hexString)
  return isHex
}



/**
 * checks if edits are done (toggled off)
 * than returns a redux state
 * with grid edits payload
 */
export const _postMapEditsToCityIO = (data, tableName, endPoint) => {
  let postURL = settings.cityIO.baseURL + tableName + endPoint

  const options = {
    method: 'post',
    url: postURL,
    data: data,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }
  axios(options)
    .then((res) => {
      if (res.data.status === 'ok') {
        console.log('--> cityIO is updated! <--')
      }
    })
    .catch((error) => {
      console.log('ERROR:', error)
    })
}



var currentDateMidnight = new Date()
// set initial midnight to GMT 0
currentDateMidnight.setHours(0, 0, 0, 0)

export const _setupSunEffects = (effectsRef, tableHeader) => {
  // get time zone from the tz value if exist
  if (tableHeader.tz) {
    currentDateMidnight.setHours(tableHeader.tz, 0, 0, 0)
  }
  const ambientLight = new AmbientLight({
    color: [255, 255, 255],
    intensity: 0.85,
  })
  const dirLight = new _SunLight({
    timestamp: 0,
    color: [255, 255, 255],
    intensity: 1.0,
    _shadow: true,
  })
  const lightingEffect = new LightingEffect({ ambientLight, dirLight })
  lightingEffect.shadowColor = [0, 0, 0, 0.5]
  effectsRef.current = [lightingEffect]
}

export const updateSunDirection = (time, effectsRef) => {
  const thisLocationTime = currentDateMidnight.getTime() + time * 1000
  var date = new Date(thisLocationTime)

  effectsRef.current[0].directionalLights[0].timestamp = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDay(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  )
}
