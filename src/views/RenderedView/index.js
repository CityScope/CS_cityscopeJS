import { useSelector } from "react-redux";
import CityIO from "../../Components/CityIO";
import RenderedViewMap from "./RenderedViewMap";

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
      {cityIOisDone && <RenderedViewMap />}
    </>
  );
}
