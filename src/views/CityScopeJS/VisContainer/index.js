import RadarChart from "./RadarChart";
import BarChart from "./BarChart";
import AreaCalc from "./AreaCalc";
import ResizableDragable from "../../../Components/ResizableDragable";
import CoreModuleSelector from "./CoreModulesSelector";

function VisContainer(props) {

  return (
    <>
    
        <ResizableDragable isVisible={props.getters.getRadar} dragConstraints={props.dragRef} setHideCard={props.setters.setRadar}
          collapsableCardTitle="Radar Chart" collapsableCardSubheader="Metrics and KPIs" child={<RadarChart/>} />
          
        <ResizableDragable isVisible={props.getters.getLand} dragConstraints={props.dragRef} setHideCard={props.setters.setLand}
          collapsableCardTitle="Land-use" collapsableCardSubheader="Land-uses Area"
          toolTipInfo="Land use distribution and area. Each cell is calculated for
                its area (square meter ^ 2 per cell) times its floors (4.5
                meters per floor)" child={<AreaCalc/>} />

        <ResizableDragable isVisible={props.getters.getBar} dragConstraints={props.dragRef} setHideCard={props.setters.setBar}
                  collapsableCardTitle="Bar Chart" collapsableCardSubheader="Metrics and KPIs"
                child={<BarChart/>} />

        <ResizableDragable isVisible={props.getters.getCore} dragConstraints={props.dragRef} setHideCard={props.setters.setCore}
          collapsableCardTitle="Modules Selector" collapsableCardSubheader=""
          child={<CoreModuleSelector/>} />
        
    </>
  );
}

export default VisContainer;
