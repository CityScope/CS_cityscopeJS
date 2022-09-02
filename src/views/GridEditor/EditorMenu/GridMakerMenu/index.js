import { useState, useEffect } from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LoadingButton from "@mui/lab/LoadingButton";
import { gridCreator } from "./gridCreator";
import { useDispatch, useSelector } from "react-redux";
import { updateGridMaker } from "../../../../redux/reducers/editorMenuSlice";

export default function GridMakerMenu() {
  const dispatch = useDispatch();
  const [grid, setGrid] = useState();
  const [loading, setLoading] = useState(false);

  const gridProps = useSelector((state) => state.editorMenuState.gridProps);
  const typesList = useSelector(
    (state) => state.editorMenuState.typesEditorState.tableData
  );

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
        <LoadingButton
          onClick={() => {
            setLoading(true);
            new Promise((resolve) => {
              setTimeout(() => {
                setLoading(false);
                handleGridCreation();
              }, 100);
              resolve();
            });
          }}
          loading={loading}
          loadingPosition="start"
          variant="outlined"
          startIcon={<AutoAwesomeIcon />}
        >
          Generate Grid
        </LoadingButton>
      )}
    </>
  );
}
