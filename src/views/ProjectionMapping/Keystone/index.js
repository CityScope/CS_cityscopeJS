import React, { useState, useEffect } from "react";
import PrjDeckGLMap from "./PrjDeckGLMap";
import Keystoner from "./Components/Keystoner";
import DeleteLocalStorage from "./Components/deleteLocalStorage";

export default function Keystone(props) {
    const clearLocalStraoge = () => {
        if (localStorage.getItem("projMap")) {
            localStorage.removeItem("projMap");
        }
        window.location.reload();
    };

    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const onKeyDown = ({ key }) => {
            if (key === " ") {
                setEditMode((editMode) => !editMode);
                console.log(key, editMode);
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [editMode]);

    return (
        <>
            {editMode && (
                <div onClick={() => clearLocalStraoge()}>
                    <DeleteLocalStorage />
                </div>
            )}

            <div
                // ! this div's props are
                // ! controling the projection z-index
                // ! on top of the menus

                style={{
                    height: "100vh",
                    width: "100vw",
                    overflow: "hidden",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 9998,
                }}
            >
                <div>
                    <Keystoner
                        style={{
                            height: "100vh",
                            width: "100vw",
                        }}
                        isEditMode={editMode}
                    >
                        <PrjDeckGLMap />
                    </Keystoner>
                </div>
            </div>
        </>
    );
}
