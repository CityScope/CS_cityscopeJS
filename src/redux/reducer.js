/**
 * ACTIONS
 */
export const GET_CITYIO_DATA = "GET_CITYIO_DATA";

export function getCityioData(data) {
    return { type: GET_CITYIO_DATA, data };
}

/**
 * INIT STATE
 */
const initialState = {
    cityioData: null
};

/**
 * REDUCER
 */
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_CITYIO_DATA:
            return action.data;

        default:
            return state;
    }
}
