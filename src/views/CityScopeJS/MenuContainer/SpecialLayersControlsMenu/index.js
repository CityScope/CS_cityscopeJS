// import the two special layers controls components from the same folder
import HeatmapLayerControls from "./HeatmapLayerControls";
import ABMLayerControls from "./ABMLayerControls";
import { useSelector } from "react-redux";

export default function SpecialLayersControlsMenu() {
  const menuState = useSelector((state) => state.menuState);
  const layersMenuState = menuState.layersMenuState;

  const ABMLayerControlsDisplay = () => {
    if (
      (layersMenuState.AGGREGATED_TRIPS_LAYER_CHECKBOX &&
        layersMenuState.AGGREGATED_TRIPS_LAYER_CHECKBOX.isOn) ||
      (layersMenuState.ABM_LAYER_CHECKBOX &&
        layersMenuState.ABM_LAYER_CHECKBOX.isOn)
    ) {
      return <ABMLayerControls />;
    }
  };

  //  return them to the menu container
  return (
    <>
      {layersMenuState.ACCESS_LAYER_CHECKBOX &&
        layersMenuState.ACCESS_LAYER_CHECKBOX.isOn && <HeatmapLayerControls />}
      {ABMLayerControlsDisplay()}
    </>
  );
}
