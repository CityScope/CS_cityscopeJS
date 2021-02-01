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

export const LISTEN_TO_ABM_MODE = "LISTEN_TO_ABM_MODE";
export function listenToABMmode(data) {
    return { type: LISTEN_TO_ABM_MODE, data };
}

export const LISTEN_TO_ACCESS_TOGGLE = "LISTEN_TO_ACCESS_TOGGLE";
export function listenToAccessToggle(data) {
    return { type: LISTEN_TO_ACCESS_TOGGLE, data };
}

export const MENU_INTERACTION = "MENU_INTERACTION";
export function listenToMenuUI(data) {
    return { type: MENU_INTERACTION, data };
}

export const LISTEN_TO_EDIT_MENU = "LISTEN_TO_EDIT_MENU";
export function listenToEditMenu(data) {
    return { type: LISTEN_TO_EDIT_MENU, data };
}

export const SET_READY_STATE = "SET_READY_STATE";
export function setReadyState(data) {
    return { type: SET_READY_STATE, data };
}

export const SET_LOADING_STATE = "SET_LOADING_STATE";
export function setLoadingState(data) {
    return { type: SET_LOADING_STATE, data };
}

export const SET_SCENARIO_NAMES = "SET_SCENARIO_NAMES";
export function setScenarioNames(data) {
    return { type: SET_SCENARIO_NAMES, data };
}

export const ADD_LOADING_MODULES = "ADD_LOADING_MODULES";
export function addLoadingModules(data) {
    return { type: ADD_LOADING_MODULES, data };
}

export const REMOVE_LOADING_MODULES = "REMOVE_LOADING_MODULES";
export function removeLoadingModules(data) {
    return { type: REMOVE_LOADING_MODULES, data };
}

/**
 * Editor Actions
 */

export const LISTEN_TO_GRID_CREATOR = "LISTEN_TO_GRID_CREATOR";
export function listenToGridCreator(data) {
    return { type: LISTEN_TO_GRID_CREATOR, data };
}

export const LISTEN_TO_ROW_EDIT = "LISTEN_TO_ROW_EDIT";
export function listenToRowEdits(data) {
    return { type: LISTEN_TO_ROW_EDIT, data };
}

export const LISTEN_TO_TYPES_LIST = "LISTEN_TO_TYPES_LIST";
export function listeonToTypesList(data) {
    return { type: LISTEN_TO_TYPES_LIST, data };
}

export const LISTEN_TO_BASE_MAP_CENTER = "LISTEN_TO_BASE_MAP_CENTER";
export function listenToBaseMapCenter(data) {
    return { type: LISTEN_TO_BASE_MAP_CENTER, data };
}
