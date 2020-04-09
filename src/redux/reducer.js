import {
    GET_CITYIO_DATA,
    MENU_INTERACTION,
    LISTEN_TO_MAP_EVENTS,
    LISTEN_TO_ABM_SLIDERS,
    LISTEN_TO_EDIT_MENU,
    SET_READY_STATE,
    SET_LOADING_STATE,
    LISTEN_TO_ACCESS_TOGGLE
} from "./actions";
import initialState from "./initialState";

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
        case LISTEN_TO_ABM_SLIDERS:
            return { ...state, SLIDERS: action.data };
        case LISTEN_TO_ACCESS_TOGGLE:
            return { ...state, ACCESS_TOGGLE: action.data };
        case LISTEN_TO_EDIT_MENU:
            return { ...state, SELECTED_TYPE: action.data };
        case SET_READY_STATE:
            return { ...state, READY: action.data };
        case SET_LOADING_STATE:
            return { ...state, LOADING: action.data };
        default:
            return state;
    }
}
