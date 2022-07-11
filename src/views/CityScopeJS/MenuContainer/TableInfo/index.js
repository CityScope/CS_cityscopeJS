import { useSelector } from "react-redux";
import { Typography, CardContent, Card } from "@mui/material";

function TableInfo() {
  const cityIOtableName = useSelector(
    (state) => state.cityIOdataState.cityIOtableName
  );

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        <Typography sx={{ fontSize: 10 }} gutterBottom>
          CityScope
        </Typography>
        <Typography variant="h3">{cityIOtableName}</Typography>
      </CardContent>
    </Card>
  );
}

export default TableInfo;
