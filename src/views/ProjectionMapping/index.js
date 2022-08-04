import { useSelector } from "react-redux";
import CityIO from "../../Components/CityIO";
import Keystone from "./Keystone";

export default function ProjectionMapping() {
  const cityIOisDone = useSelector(
    (state) => state.cityIOdataState.cityIOisDone
  );
  const tableName = useSelector(
    (state) => state.cityIOdataState.cityIOtableName
  );

  return (
    <>
      {/* {tableName && <CityIO tableName={tableName} />}
      {cityIOisDone && <Keystone />} */}

      <Keystone />
    </>
  );
}
