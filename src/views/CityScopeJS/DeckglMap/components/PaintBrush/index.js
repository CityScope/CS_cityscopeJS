import { PaintBrush } from './PaintBrush'
import { CellMeta } from '../CellMeta'

export default function PaintBrushContainer({
  editOn,
  mousePos,
  selectedType,
  pickingRadius,
  mouseDown,
  hoveredObj,
}) {
  return (
    <>
      {editOn && selectedType && hoveredObj && (
        <PaintBrush
          mousePos={mousePos}
          selectedType={selectedType}
          divSize={pickingRadius}
          mouseDown={mouseDown}
          hoveredCells={hoveredObj}
        />
      )}

      {!editOn && hoveredObj && (
        <CellMeta mousePos={mousePos} hoveredObj={hoveredObj} />
      )}
    </>
  )
}
