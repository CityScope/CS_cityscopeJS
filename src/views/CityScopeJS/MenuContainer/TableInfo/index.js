import { useSelector } from "react-redux";
import { Typography, CardContent, Card } from "@mui/material";
import { useState, useEffect } from "react";

function TableInfo() {
  const [cityIOstate, setCityIOstate] = useState(false);

  const cityIOisDone = useSelector(
    (state) => state.cityIOdataState.cityIOisDone
  );

  useEffect(() => {
    setCityIOstate(cityIOisDone);
  }, [cityIOisDone]);

  const cityIOtableName = useSelector(
    (state) => state.cityIOdataState.cityIOtableName
  );

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        <Typography gutterBottom>CityScope</Typography>
        <Typography variant="h2">{cityIOtableName}</Typography>
        <Typography gutterBottom>
          {cityIOstate ? "Done" : "Not Done"}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default TableInfo;
