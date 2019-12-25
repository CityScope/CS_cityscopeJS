import { GET_CITYIO } from "./actions";

const initialState = {
    cityio_data: { cityio_data: null }
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case GET_CITYIO:
            return {
                cityio_data: action.cityio_data
            };
        default:
            return state;
    }
}
export default rootReducer;
