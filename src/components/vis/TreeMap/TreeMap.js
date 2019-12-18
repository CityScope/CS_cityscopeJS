import React from "react";
import { Treemap } from "react-vis";
import "./TreeMap.css";

function _getRandomData(total) {
  const totalValues = 20;
  const values = [];
  for (let i = 0; i < totalValues; i++) {
    values.push({
      name: total ? total : String(Math.random()).slice(0, 3),
      size: Math.random() * 1000,
      color: Math.random(),
      style: {
        border: "thin solid white"
      }
    });
  }

  let res = {
    color: 0,
    children: values
  };
  return res;
}

export default class TreeMap extends React.Component {
  state = {
    hoveredNode: false,
    treemapData: _getRandomData(20),
    useCirclePacking: false,
    mode: "circlePack"
  };

  render() {
    const treeProps = {
      animation: {
        damping: 15,
        stiffness: 600
      },
      data: this.state.treemapData,
      onLeafMouseOver: () => {
        this.setState({ treemapData: _getRandomData() });
      },
      height: 300,
      width: 300,
      mode: this.state.mode,
      getLabel: x => x.name,
      colorRange: ["#79C7E3", "#fc03ec"],
      opacity: 0.9,
      hideRootNode: true
    };
    return (
      <div className="TreeMap">
        <Treemap {...treeProps} />
        <h1>Not Radar 1</h1>
      </div>
    );
  }
}
