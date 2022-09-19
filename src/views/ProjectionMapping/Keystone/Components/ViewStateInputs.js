import { TextField, Box } from "@mui/material";
// convert every item in viewState to an input field
// that can be edited and update the viewState with the new values
function ViewStateInputs(props) {
  const viewState = props.viewState;
  const setViewState = props.setViewState;
  const viewToggles = Object.keys(viewState).map((key) => {
    if (Number.isFinite(viewState[key])) {
      return (
        <TextField
          key={key}
          id="outlined-number"
          label={key}
          type="number"
          value={viewState[key]}
          onChange={(e) => {
            setViewState({
              ...viewState,
              [key]: parseFloat(e.target.value),
            });
          }}
        />
      );
    } else {
      return null;
    }
  });
  return (
    <Box
      sx={{
        component: "form",
        backgroundColor: "rgba(0,0,0,0.95)",
        "& .MuiTextField-root": { m: 2, width: "90%" },
        bottom: "1vh",
        left: "1vw",
        maxWidth: "30%",
        position: "fixed",
        zIndex: "tooltip",
      }}
      noValidate
      autoComplete="off"
    >
      <div>Changes are saved automatically. Press [ z ] again to hide.</div>

      <div>{viewToggles}</div>
    </Box>
  );
}

export default ViewStateInputs;
