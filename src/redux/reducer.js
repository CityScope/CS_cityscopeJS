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

export const MENU_INTERACTION = "MENU_INTERACTION";

export function listenToMenuUI(data) {
    return { type: MENU_INTERACTION, data };
}

/**
 * INIT STATE
 */
const initialState = { MENU: [], CITYIO: {}, MAP: {} };

/**
 * REDUCER
 */
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_CITYIO_DATA:
            return { ...state, CITYIO: action.data };

        case MENU_INTERACTION:
            return { ...state, MENU: action.data };

        case LISTEN_TO_MAP_EVENTS:
            return { ...state, MAP: action.data };

        default:
            return state;
    }
}
