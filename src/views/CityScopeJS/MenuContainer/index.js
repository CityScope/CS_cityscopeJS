import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { listenToMenuUI } from "../../../redux/actions";
import EditMenu from "./EditMenu";
import TogglesMenu from "./TogglesMenu";
import SaveMenu from "./SaveMenu";
import { Button, Typography, List, ListItem } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import NavigationIcon from "@material-ui/icons/Navigation";

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
            <List>
                <ListItem>
                    <Typography variant={"h2"}>Grid Edit</Typography>
                </ListItem>
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
                    ></Button>
                </ListItem>

                <EditMenu />

                <ListItem>
                    <Typography variant={"h2"}>Scenarios</Typography>
                </ListItem>
                <ListItem>
                    <SaveMenu
                        tableName={tableName}
                        handleToggle={handleToggle}
                    />
                </ListItem>
                <ListItem>
                    <Typography variant={"h2"}>View Options</Typography>
                </ListItem>
                <ListItem>
                    <Button
                        startIcon={
                            <>
                                <NavigationIcon />
                                Reset View
                            </>
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
