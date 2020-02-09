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
    MAP: {},
    SLIDERS: {},
    SELECTED_TYPE: {
        height: 0,
        color: [255, 0, 0, 200],
        name: "Select Land-Use!"
    }
};

export default initialState;
