export default function SelectionTarget(props) {
  if (!props.mousePos) return null;
  const mousePos = props.mousePos;
  const mouseDown = props.mouseDown;
  const selectedType = props.selectedType;
  const divSize = props.divSize;
  let mouseX = mousePos.x - divSize / 2;
  let mouseY = mousePos.y - divSize / 2;
  return (
    <div
      style={{
        border: "2px solid",
        backgroundColor: mouseDown ? selectedType.color : "rgba(0,0,0,0)",
        borderColor: selectedType.color,
        color: selectedType.color,
        borderRadius: "15%",
        position: "fixed",
        zIndex: 1,
        pointerEvents: "none",
        width: divSize,
        height: divSize,
        left: mouseX || 0,
        top: mouseY || 0,
      }}
    >
      <div
        style={{
          position: "relative",
          left: divSize + 10,
          fontSize: "0.5em",
        }}
      >
        {selectedType.name}
      </div>
    </div>
  );
}
