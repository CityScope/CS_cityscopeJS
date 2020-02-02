import settings from "../settings/settings.json";

import {
    GET_CITYIO_DATA,
    MENU_INTERACTION,
    LISTEN_TO_MAP_EVENTS,
    LISTEN_TO_ABM_SLIDERS,
    LISTEN_TO_TYPE_EDITOR
} from "./actions";

/**
 * ! INIT STATE -- to be removed from reducer
 */
const listOfToggles = Object.keys(settings.menu.toggles);
let menuInitState = [];
for (let i = 0; i < listOfToggles.length; i++) {
    if (Object.values(settings.menu.toggles)[i].showOnInit) {
        menuInitState.push(listOfToggles[i]);
    }
}

const initialState = {
    MENU: menuInitState,
    CITYIO: {},
    MAP: {},
    SLIDERS: {},
    SELECTED_TYPE: {
        height: 0,
        color: [0, 0, 0, 0],
        name: "Clear Buildings"
    }
};

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
        case LISTEN_TO_TYPE_EDITOR:
            return { ...state, SELECTED_TYPE: action.data };
        default:
            return state;
    }
}
