import {
    GET_CITYIO_DATA,
    MENU_INTERACTION,
    LISTEN_TO_MAP_EVENTS,
    LISTEN_TO_ABM_SLIDERS,
    LISTEN_TO_EDIT_MENU,
    SET_READY_STATE,
    SET_LOADING_STATE,
    SET_SCENARIO_NAMES,
    LISTEN_TO_ACCESS_TOGGLE,
    LISTEN_TO_ROW_EDIT,
    LISTEN_TO_TYPES_LIST,
    LISTEN_TO_GRID_CREATOR,
    LISTEN_TO_BASE_MAP_CENTER,
    LISTEN_TO_ABM_MODE,
    ADD_LOADING_MODULES,
    REMOVE_LOADING_MODULES,
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
        case LISTEN_TO_ABM_MODE:
            return { ...state, ABM_MODE: action.data };
        case LISTEN_TO_ACCESS_TOGGLE:
            return { ...state, ACCESS_TOGGLE: action.data };
        case LISTEN_TO_EDIT_MENU:
            return { ...state, SELECTED_TYPE: action.data };
        case SET_READY_STATE:
            return { ...state, READY: action.data };
        case SET_LOADING_STATE:
            return { ...state, LOADING: action.data };
        case SET_SCENARIO_NAMES:
            return { ...state, SCENARIO_NAMES: action.data };
        case ADD_LOADING_MODULES:
            return {
                ...state,
                LOADING_MODULES: [
                    ...new Set([...state.LOADING_MODULES, ...action.data]),
                ],
            };
        case REMOVE_LOADING_MODULES:
            return {
                ...state,
                LOADING_MODULES: state.LOADING_MODULES.filter(
                    (x) => !action.data.includes(x)
                ),
            };

        //! Editor
        case LISTEN_TO_ROW_EDIT:
            return { ...state, ROW_EDIT: action.data };

        case LISTEN_TO_TYPES_LIST:
            return { ...state, TYPES_LIST: action.data };

        case LISTEN_TO_GRID_CREATOR:
            return { ...state, GRID_CREATED: action.data };

        case LISTEN_TO_BASE_MAP_CENTER:
            return { ...state, BASE_MAP_CENTER: action.data };

        default:
            return state;
    }
}
