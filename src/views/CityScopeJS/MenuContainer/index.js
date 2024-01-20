import TypesMenu from "./TypesMenu";
import LayersMenu from "./LayersMenu";
import ViewSettingsMenu from "./ViewSettingsMenu";
import ScenariosMenu from "./ScenariosMenu";
import EditMenu from "./EditMenu";
import SpecialLayersControlsMenu from "./SpecialLayersControlsMenu/";
import ResizableDragable from "../../../Components/ResizableDragable";

function MenuContainer(props) {

  return (
  <>
    <ResizableDragable isVisible={props.getters.getEdit} dragConstraints={props.dragRef} setHideCard={props.setters.setEdit}
    collapsableCardTitle="Edit Mode" collapsableCardSubheader="Select Types & Edit" child={<><EditMenu/><TypesMenu/></>} />

    <ResizableDragable isVisible={props.getters.getScenarios} dragConstraints={props.dragRef} setHideCard={props.setters.setScenarios}
    collapsableCardTitle="Scenarios" collapsableCardSubheader="Save and Load Scenarios" child={<ScenariosMenu/>} />
  
    <ResizableDragable isVisible={props.getters.getLayers} dragConstraints={props.dragRef} setHideCard={props.setters.setLayers}
    collapsableCardTitle="Layers" collapsableCardSubheader="Layers visibility" child={<><LayersMenu/><SpecialLayersControlsMenu/></>} />

    <ResizableDragable isVisible={props.getters.getView} dragConstraints={props.dragRef} setHideCard={props.setters.setView}
    collapsableCardTitle="View Settings" collapsableCardSubheader="Toggle different visibility settings" child={<ViewSettingsMenu/>} />

  </>
);
}

export default MenuContainer;
