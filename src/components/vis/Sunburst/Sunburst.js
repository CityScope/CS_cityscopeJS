import React from "react";
import { Hint, Sunburst } from "react-vis";
import "./Sunburst.css";

const COLORS = ["#79C7E3", "#79A7E3", "#fc03ec", "#7937E3", "#a703ec"];

const DATA = {
  children: [
    {
      children: [
        {
          bigness: 1,
          children: [],
          clr: COLORS[1],
          name: "energy to love ratio"
        },
        { bigness: 1, clr: COLORS[2], name: "chart" }
      ],
      clr: COLORS[3]
    },
    {
      bigness: 1,
      children: [],
      clr: COLORS[4],
      name: "cool"
    }
  ],
  name: "wow"
};

const tipStyle = {
  display: "flex",
  color: "#fff",
  background: "#000",
  alignItems: "center",
  padding: "10px"
};
const boxStyle = { height: "5px", width: "5px" };

function buildValue(hoveredCell) {
  const { radius, angle, angle0 } = hoveredCell;
  const truedAngle = (angle + angle0) / 2;
  return {
    x: radius * Math.cos(truedAngle),
    y: radius * Math.sin(truedAngle)
  };
}

export default class SunburstWithTooltips extends React.Component {
  state = {
    hoveredCell: false,
    hoverdName: null
  };
  render() {
    const { hoveredCell, hoverdName } = this.state;
    return (
      <div className="SunburstWithTooltips">
        <Sunburst
          data={DATA}
          style={{ stroke: "#fff" }}
          onValueMouseOver={v => {
            this.setState({
              hoveredCell: v.x && v.y ? v : false,
              hoverdName: v.name
            });
          }}
          onValueMouseOut={v =>
            this.setState({ hoveredCell: false, hoverdName: null })
          }
          height={200}
          width={200}
          margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
          getLabel={d => d.name}
          getSize={d => d.bigness}
          getColor={d => d.clr}
          padAngle={() => 0.01}
        >
          {hoveredCell ? (
            <Hint value={buildValue(hoveredCell)}>
              <div style={tipStyle}>
                <div style={{ ...boxStyle, background: hoveredCell.clr }} />
                {hoverdName}
              </div>
            </Hint>
          ) : null}
        </Sunburst>
        <h1>Not Radar 2</h1>
      </div>
    );
  }
}
