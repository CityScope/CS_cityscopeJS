import { PaintBrush } from "./PaintBrush";
import { CellMeta } from "./CellMeta";

export default function PaintBrushContainer({
  editOn,
  mousePos,
  selectedType,
  pickingRadius,
  mouseDown,
  hoveredObj,
}) {
  const BrushSelector = () => {
    if (
      editOn &&
      selectedType &&
      Object.keys(selectedType).length &&
      hoveredObj
    ) {
      return (
        <PaintBrush
          mousePos={mousePos}
          selectedType={selectedType}
          divSize={pickingRadius}
          mouseDown={mouseDown}
          hoveredCells={hoveredObj}
        />
      );
    } else if (hoveredObj) {
      return <CellMeta mousePos={mousePos} hoveredObj={hoveredObj} />;
    } else {
      return null;
    }
  };
  return <BrushSelector />;
}
