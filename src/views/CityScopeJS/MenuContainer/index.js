import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { listenToMenuUI } from "../../../redux/actions";
import EditMenu from "./EditMenu";
import TogglesMenu from "./TogglesMenu";
import SaveMenu from "./SaveMenu";
import { Collapse, Button, List, ListItem } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import NearMeIcon from "@material-ui/icons/NearMe";
import NavigationIcon from "@material-ui/icons/Navigation";

function MenuContainer(props) {
    //

    const [selectedIndex, setSelectedIndex] = React.useState(null);

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
            <List>
                <ListItem>
                    <Button
                        startIcon={
                            menuState.includes("EDIT") ? (
                                <>
                                    <CloudUploadIcon />
                                    Send to cityIO
                                </>
                            ) : (
                                <>
                                    <EditIcon />
                                    Edit Mode
                                </>
                            )
                        }
                        color="default"
                        onClick={handleToggle("EDIT")}
                    >
                        {/* setSelectedIndex(selectedIndex ? false : true)}> */}
                    </Button>
                </ListItem>

                {/* <Collapse in={selectedIndex}> */}
                    <EditMenu />
                {/* </Collapse> */}

                <ListItem>
                    <SaveMenu
                        tableName={tableName}
                        handleToggle={handleToggle}
                    />
                </ListItem>
                <ListItem>
                    <Button
                        startIcon={
                            menuState.includes("RESET_VIEW") ? (
                                <>
                                    <NavigationIcon />
                                    Reset View
                                </>
                            ) : (
                                <>
                                    <NearMeIcon />
                                    ISO/Perspective
                                </>
                            )
                        }
                        color="default"
                        onClick={handleToggle("RESET_VIEW")}
                    />
                </ListItem>
            </List>
            <TogglesMenu handleToggle={handleToggle} />
        </>
    );
}

export default MenuContainer;
