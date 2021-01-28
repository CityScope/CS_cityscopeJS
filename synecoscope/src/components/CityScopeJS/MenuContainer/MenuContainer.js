import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { listenToMenuUI } from "../../../redux/actions";
import EditMenu from "./EditMenu/EditMenu";
import TogglesMenu from "./TogglesMenu";
import FABMenu from "./FABMenu";
import SaveMenu from "./SaveMenu";

function MenuContainer(props) {
    const { tableName } = props;
    const menuState = useSelector((state) => state.MENU);
    const dispatch = useDispatch();

    const [state, setState] = React.useState({
        drawerOpen: false,
        saveDrawerOpen: false,
    });

    const toggleDrawer = () => {
        setState({ ...state, drawerOpen: !state.drawerOpen });
    };

    const toggleSaveDrawer = () => {
        setState({ ...state, saveDrawerOpen: !state.saveDrawerOpen });
    };

    const handleToggle = (value) => () => {
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
            <FABMenu
                toggleDrawer={toggleDrawer}
                handleToggle={handleToggle}
                toggleSaveDrawer={toggleSaveDrawer}
            />
            {showEditMenu && <EditMenu key={"EDIT"} />}
            <SaveMenu
                tableName={tableName}
                handleToggle={handleToggle}
                toggleDrawer={toggleSaveDrawer}
                open={state.saveDrawerOpen}
            />
        </div>
    );
}

export default MenuContainer;
