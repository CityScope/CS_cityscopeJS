export const GET_CITYIO = "GET_CITYIO";

export function getCityioData(cityio_data) {
    return { type: GET_CITYIO, cityio_data: cityio_data };
}
