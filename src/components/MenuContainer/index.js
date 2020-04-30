import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { listenToMenuUI } from "../../redux/actions";
import EditMenu from "./EditMenu";
import TogglesMenu from "./TogglesMenu";
import FABMenu from "./FABMenu";
import SavedScenariosMenu from "./SavedScenariosMenu";

function MenuContainer() {
    const menuState = useSelector(state => state.MENU);

    const dispatch = useDispatch();

    const [state, setState] = React.useState({
        drawerOpen: false,
        SavedScenariosMenuOpen: false
    });

    const toggleDrawer = () => {
        setState({ ...state, drawerOpen: !state.drawerOpen });
    };

    const handleToggle = value => {
        const i = menuState.indexOf(value);
        const updatedMenuState = [...menuState];
        if (i === -1) {
            updatedMenuState.push(value);
        } else {
            updatedMenuState.splice(i, 1);
        }

        dispatch(listenToMenuUI(updatedMenuState));
    };

    const showEditMenu = menuState && menuState.includes("EDIT");

    return (
        <div>
            <TogglesMenu
                open={state.drawerOpen}
                toggleDrawer={toggleDrawer}
                handleToggle={handleToggle}
            />
            <FABMenu toggleDrawer={toggleDrawer} handleToggle={handleToggle} />
            <SavedScenariosMenu handleToggle={handleToggle} />
            {showEditMenu && <EditMenu key={"EDIT"} />}
        </div>
    );
}

export default MenuContainer;
