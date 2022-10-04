import { useSelector } from "react-redux";
import CityIO from "../../Components/CityIO";
import RenderedViewMap from "./RenderedViewMap";
import { Container } from "@mui/material";

export default function RenderedView() {
  const cityIOisDone = useSelector(
    (state) => state.cityIOdataState.cityIOisDone
  );
  const tableName = useSelector(
    (state) => state.cityIOdataState.cityIOtableName
  );

  return (
    <>
      {tableName && <CityIO tableName={tableName} />}
      <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
        {cityIOisDone && <RenderedViewMap />}
      </Container>
    </>
  );
}
