import CityIO from "../../Components/CityIO";
import { useSelector } from "react-redux";
import MenuContainer from "./MenuContainer";
import DeckGLMap from "./DeckglMap/index";
import VisContainer from "./VisContainer";
import ResponsiveAppBar from "./AppBar";
import { Box } from "@mui/material";
import { useState, useRef } from "react";

export default function CityScopeJS() {
  const cityIOisDone = useSelector(
    (state) => state.cityIOdataState.cityIOisDone
  );
  const tableName = useSelector(
    (state) => state.cityIOdataState.cityIOtableName
  );
  const [isOpenCoreModule, setOpenCoreModule] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [isOpenScenarios, setIsOpenScenarios] = useState(false)
  const [isOpenLayers, setIsOpenLayers] = useState(false)
  const [isOpenView, setIsOpenView] = useState(false)
  const [isOpenRadarChart, setIsOpenRadarChart] = useState(false)
  const [isOpenLandUse, setIsOpenLandUse] = useState(false)
  const [isOpenBarChart, setIsOpenBarChart] = useState(false)

  const constraintsRef = useRef(null);

  const setters = {'setEdit':setIsOpenEdit,'setScenarios':setIsOpenScenarios,'setLayers':setIsOpenLayers,
    'setView':setIsOpenView,'setRadar':setIsOpenRadarChart,'setLand':setIsOpenLandUse,'setBar':setIsOpenBarChart, 
   'setCore':setOpenCoreModule}

  const getters = {'getEdit':isOpenEdit,'getScenarios':isOpenScenarios,'getLayers':isOpenLayers,
  'getView':isOpenView,'getRadar':isOpenRadarChart,'getLand':isOpenLandUse,'getBar':isOpenBarChart,
  'getCore':isOpenCoreModule}

  return (
    <>
      {/* if we got a cityIO table name, start cityIO module */}
      {tableName && <CityIO tableName={tableName} />}
      {/* if cityIO module is done loading, start the CSjs app */}
      {cityIOisDone && (
        <>
            <DeckGLMap/>
            <ResponsiveAppBar setters={setters} tableName={tableName} />
            <Box width={"100vw"} height={"94%"} zIndex={1000} ref={constraintsRef} 
        sx={{overflow: 'hidden', position:'fixed', top: '64px', left: '0%', pointerEvents: 'none'}} >
              <MenuContainer getters={getters} setters={setters} dragRef={constraintsRef}/>
              <VisContainer getters={getters} setters={setters} dragRef={constraintsRef}/>
            </Box>  
        </>
      )}
    </>
  );
}
