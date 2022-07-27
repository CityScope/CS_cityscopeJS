import Button from "@mui/material/Button";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import { useDispatch } from "react-redux";
import { updateEditorMapCenter } from "../../../../../redux/reducers/editorMenuSlice";

export default function CenterMapButton(props) {
  const dispatch = useDispatch();

  return (
    <Button
      onClick={() => {
        dispatch(
          updateEditorMapCenter({
            latCenter: parseFloat(props.mapCenter[0]),
            lonCenter: parseFloat(props.mapCenter[1]),
          })
        );
      }}
      variant="outlined"
      startIcon={<CenterFocusStrongIcon />}
    >
      Center Map to Grid
    </Button>
  );
}
