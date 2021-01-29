import settings from "../settings/settings.json";

/**
 * ! INIT STATE
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
    SCENARIO_NAMES: [],
    MAP: {},
    LOADING_MODULES: [],
    SLIDERS: {
        time: [
            settings.map.layers.ABM.startSimHour,
            settings.map.layers.ABM.currentSimHour,
            settings.map.layers.ABM.endSimHour,
        ],
        speed: settings.map.layers.ABM.animationSpeed,
    },
    ABM_MODE: "mode",
    ACCESS_TOGGLE: 0,
    SELECTED_TYPE: null,
    READY: false,
    LOADING: false,

    /**
     * ! EDITOR INIT STATE
     */

    ROW_EDIT: null,
    BASE_MAP_CENTER: {
        latCenter: null,
        lonCenter: null,
    },
    TYPES_LIST: null,
    GRID_CREATED: null,
};

export default initialState;
