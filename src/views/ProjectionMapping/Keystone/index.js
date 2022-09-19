import { useState, useEffect } from "react";
import ProjectionDeckMap from "./ProjectionDeckMap";
import Keystoner from "./Components/Keystoner";
import DeleteLocalStorage from "./Components/deleteLocalStorage";
import { useSelector } from "react-redux";

export default function Keystone() {
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const numCols = cityIOdata.GEOGRID.properties.header.ncols;
  const numRows = cityIOdata.GEOGRID.properties.header.nrows;
  const tableRatio = numCols / numRows;
  console.log("cols:", numCols, "rows:", numRows, "table ratio:", tableRatio);

  const [editMode, setEditMode] = useState(false);
  const [viewStateEditMode, setViewStateEditMode] = useState(false);
  
  const clearLocalStorage = () => {
    if (localStorage.getItem("projMap")) {
      localStorage.removeItem("projMap");
    }
    if (localStorage.getItem("projectionViewStateStorage")) {
      localStorage.removeItem("projectionViewStateStorage");
    }
    window.location.reload();
  };

  useEffect(() => {
    console.log("Keystone starting...");
    const onKeyDown = ({ key }) => {
      if (key === " ") {
        setEditMode((editMode) => !editMode);
      }
      // if the key is 'z', display the viewState editor
      if (key === "z") {
        setViewStateEditMode((viewStateEditMode) => !viewStateEditMode);
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
        <div onClick={() => clearLocalStorage()}>
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
          zIndex: 1000,
        }}
      >
        <div>
          <Keystoner
            style={{
              height: "100vh",
              width: `${tableRatio * 100}vh`,
              backgroundColor: editMode ? "rgba(255,0,0)" : null,
            }}
            isEditMode={editMode}
          >
            <ProjectionDeckMap
              editMode={editMode}
              viewStateEditMode={viewStateEditMode}
            />
          </Keystoner>
        </div>
      </div>
    </>
  );
}
