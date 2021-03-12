import React from "react";
import PrjDeckGLMap from "../PrjDeckGLMap";
import Keystoner from "./Components/Keystoner";
import DeleteLocalStorage from "./Components/deleteLocalStorage";

export default function Keystone(props) {
    const clearLocalStraoge = () => {
        if (localStorage.getItem("projMap")) {
            localStorage.removeItem("projMap");
        }
        window.location.reload();
    };

    return (
        <>
            <div onClick={() => clearLocalStraoge()}>
                <DeleteLocalStorage />
            </div>

            <div
                style={{
                    height: "100vh",
                    width: "100vw",
                    overflow: "hidden",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 9999,
                }}
            >
                <Keystoner
                    style={{
                        height: "100vh",
                        width: "100vw",
                    }}
                    isEditMode={true}
                >
                    <PrjDeckGLMap />
                </Keystoner>
            </div>
        </>
    );
}
