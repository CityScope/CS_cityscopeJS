// import the two special layers controls components from the same folder
import HeatmapLayerControls from "./HeatmapLayerControls";
import ABMLayerControls from "./ABMLayerControls";
import { useSelector } from "react-redux";

export default function SpecialLayersControlsMenu() {
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const accessData = cityIOdata.access;
  const abmData = cityIOdata.ABM2;
  //  return them to the menu container
  return (
    <>
      {accessData && <HeatmapLayerControls />}
      {abmData && <ABMLayerControls />}
    </>
  );
}
