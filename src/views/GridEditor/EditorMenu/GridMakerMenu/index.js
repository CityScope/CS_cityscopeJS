import { useState, useEffect } from "react";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Button from "@mui/material/Button";
import { gridCreator } from "./gridCreator";
import { useDispatch, useSelector } from "react-redux";
import { updateGridMaker } from "../../../../redux/reducers/editorMenuSlice";

export default function GridMakerMenu() {
  const dispatch = useDispatch();

  const [grid, setGrid] = useState(null);

  const gridProps = useSelector((state) => state.editorMenuState.gridProps);
  const typesList = useSelector((state) => state.editorMenuState.typesList);

  useEffect(() => {
    dispatch(updateGridMaker(grid));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid]);

  const handleGridCreation = () => {
    setGrid(gridCreator(gridProps, typesList));
  };

  return (
    <>
      {gridProps && typesList && (
        <Button
          sx={{ width: "100%" }}
          onClick={() => {
            handleGridCreation();
          }}
          variant="outlined"
          startIcon={<AutoAwesomeIcon />}
        >
          Generate Grid
        </Button>
      )}
    </>
  );
}
