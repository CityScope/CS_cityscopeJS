/**
 * ACTIONS
 */
export const GET_CITYIO_DATA = "GET_CITYIO_DATA";

export function getCityioData(data) {
    return { type: GET_CITYIO_DATA, data };
}

export const MENU_INTERACTION = "MENU_INTERACTION";

export function listenToMenuUI(data) {
    return { type: MENU_INTERACTION, data };
}

/**
 * INIT STATE
 */
const initialState = {};

/**
 * REDUCER
 */
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_CITYIO_DATA:
            return { ...state, CITYIO: action.data };

        case MENU_INTERACTION:
            return { ...state, MENU: action.data };

        default:
            return state;
    }
}
