import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { listenToMenuUI } from "../../../redux/actions";
import EditMenu from "./EditMenu";
import TogglesMenu from "./TogglesMenu";
import FABMenu from "./FABMenu";
import SaveMenu from "./SaveMenu";
import { Collapse } from "@material-ui/core";

function MenuContainer(props) {
    //

    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const handleListItemClick = (event, name, typeProps) => {
        // ! injects the type name into the attributes themselves

        setSelectedIndex(name);
    };

    //
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
            <SaveMenu tableName={tableName} handleToggle={handleToggle} />
            <TogglesMenu handleToggle={handleToggle} />
            <Collapse in={selectedIndex}>
                <EditMenu />
            </Collapse>
        </>
    );
}

export default MenuContainer;
