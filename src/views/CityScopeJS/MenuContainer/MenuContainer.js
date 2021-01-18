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

    return (
        <>
            <FABMenu handleToggle={handleToggle} />
            <TogglesMenu handleToggle={handleToggle} />
            <EditMenu key={"EDIT"} />
            <SaveMenu tableName={tableName} handleToggle={handleToggle} />
        </>
    );
}

export default MenuContainer;
