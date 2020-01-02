/**
 * ACTIONS
 */
export const GET_CITYIO_DATA = "GET_CITYIO_DATA";
export function getCityioData(data) {
    return { type: GET_CITYIO_DATA, data };
}

export const LISTEN_TO_MAP_EVENTS = "LISTEN_TO_MAP_EVENTS";
export function listenToMapEvents(data) {
    return { type: LISTEN_TO_MAP_EVENTS, data };
}

export const LISTEN_TO_ABM_SLIDERS = "LISTEN_TO_ABM_SLIDERS";
export function listenToSlidersEvents(data) {
    return { type: LISTEN_TO_ABM_SLIDERS, data };
}

export const MENU_INTERACTION = "MENU_INTERACTION";

export function listenToMenuUI(data) {
    return { type: MENU_INTERACTION, data };
}
