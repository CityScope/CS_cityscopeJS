// import the two special layers controls components from the same folder
import HeatmapLayerControls from "./HeatmapLayerControls";
import ABMLayerControls from "./ABMLayerControls";

export default function SpecialLayersControlsMenu() {
  //  return them to the menu container
  return (
    <>
      <HeatmapLayerControls />
      <ABMLayerControls />
    </>
  );
}
