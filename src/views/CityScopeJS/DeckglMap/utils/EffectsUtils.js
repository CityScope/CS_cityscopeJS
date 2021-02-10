import { LightingEffect, AmbientLight, _SunLight } from "@deck.gl/core";

var currentDateMidnight = new Date();
currentDateMidnight.setHours(0, 0, 0, 0);

export const _setupSunEffects = (effectsRef, tableHeader) => {
    // get time zone from the tz value if exist
    if (tableHeader.tz) {
        currentDateMidnight.setHours(tableHeader.tz, 0, 0, 0);
    }
    const ambientLight = new AmbientLight({
        color: [255, 255, 255],
        intensity: 0.85,
    });
    const dirLight = new _SunLight({
        timestamp: 0,
        color: [255, 255, 255],
        intensity: 1.0,
        _shadow: true,
    });
    const lightingEffect = new LightingEffect({ ambientLight, dirLight });
    lightingEffect.shadowColor = [0, 0, 0, 0.5];
    effectsRef.current = [lightingEffect];
};

export const updateSunDirection = (time, effectsRef) => {
    console.log(currentDateMidnight);
    
    const thisLocationTime = currentDateMidnight.getTime() + time * 1000;

    var date = new Date(thisLocationTime);

    effectsRef.current[0].directionalLights[0].timestamp = Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDay(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
    );
};
