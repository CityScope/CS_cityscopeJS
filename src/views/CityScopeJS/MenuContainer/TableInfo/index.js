import { useSelector } from "react-redux";
import { Typography } from "@mui/material";

function TableInfo() {
  const cityIOtableName = useSelector(
    (state) => state.cityIOdataState.cityIOtableName
  );

  return (
    <>
      <Typography gutterBottom>CityScope</Typography>
      <Typography variant="h3">{cityIOtableName}</Typography>
    </>
  );
}

export default TableInfo;
