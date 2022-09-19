import { Switch, Box } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

function LayerControls(props) {
  const layersArray = props.layersArray();

  // update the layer.props.visible value when the switch is toggled
  const layerToggles = layersArray.map((layer) => {
    let t = { ...layer.props };
    console.log( t);
    return (
      <FormControlLabel
        key={layer.id}
        control={
          <Switch
            checked={t.visible}
            onChange={(e) => {
              t.visible = e.target.checked;
            }}
          />
        }
        label={layer.props.id}
      />
    );
  });

  return (
    <Box
      sx={{
        backgroundColor: "rgba(0,0,0,0.95)",
        "& .MuiTextField-root": { m: 2 },
        top: "1vh",
        left: "1vw",
        maxWidth: "100%",
        position: "fixed",
        zIndex: "tooltip",
      }}
    >
      <FormGroup>{layerToggles}</FormGroup>
    </Box>
  );
}

export default LayerControls;
