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

export const LISTEN_TO_ACCESS_TOGGLE = "LISTEN_TO_ACCESS_TOGGLE";
export function listenToAccessToggle(data) {
    return { type: LISTEN_TO_ACCESS_TOGGLE, data };
}

export const MENU_INTERACTION = "MENU_INTERACTION";

export function listenToMenuUI(data) {
    return { type: MENU_INTERACTION, data };
}

export const LISTEN_TO_TYPE_EDITOR = "LISTEN_TO_TYPE_EDITOR";
export function listenToTypeEditor(data) {
    return { type: LISTEN_TO_TYPE_EDITOR, data };
}

export const SET_READY_STATE = "SET_READY_STATE";
export function setReadyState(data) {
    return { type: SET_READY_STATE, data };
}

export const SET_LOADING_STATE = "SET_LOADING_STATE";
export function setLoadingState(data) {
    return { type: SET_LOADING_STATE, data };
}
