import * as React from "react";
import { AnchorComponent } from "./anchor";
const { solve } = require("numeric");

export const round = (num: number, precision: number) => {
  var factor = Math.pow(10, precision);
  var tempNumber = num * factor;
  var roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
};

// tslint:disable-next-line:no-any
export const range = (num: number) =>
  (Array as any)(num)
    .fill()
    .map((_: any, i: any) => i * i);

export const transformPointsToMatrix = (
  sourcePoints: RectPoints,
  targetPoints: RectPoints
): Matrix3d => {
  const a: number[][] = [];
  const b: number[] = [];

  for (let i = 0, n = sourcePoints.length; i < n; ++i) {
    const [fromX, fromY] = sourcePoints[i];
    const [toX, toY] = targetPoints[i];

    a.push(
      [fromX, fromY, 1, 0, 0, 0, -fromX * toX, -fromY * toX],
      [0, 0, 0, fromX, fromY, 1, -fromX * toY, -fromY * toY]
    );

    b.push(toX, toY);
  }

  const h = solve(a, b, true);

  return [
    h[0],
    h[3],
    0,
    h[6],
    h[1],
    h[4],
    0,
    h[7],
    0,
    0,
    1,
    0,
    h[2],
    h[5],
    0,
    1,
  ].map((num) => round(num, 10)) as Matrix3d;
};

export const matrixToTransform = (matrix: Matrix3d) =>
  `matrix3d(${matrix.join(", ")})`;

export const vectorToTransform = (vector: Vector) =>
  `translate(${vector[0]}px, ${vector[1]}px)`;

// Component interfaces
export interface Props {
  style?: React.CSSProperties;
  className?: string;
  isEditMode?: boolean;
  x?: number;
  y?: number;
  anchorStyle?: React.CSSProperties;
  anchorClassName?: string;
  children?: React.ReactNode;
}

export interface Context {
  isEditMode: boolean;
}

export interface State {
  matrix: Matrix3d;
  translateDelta: { [key: string]: Vector };
  sourcePoints?: RectPoints;
  transformOrigin: Vector;
  containerTranslate: Vector;
}

const styles = {
  container: {
    position: "relative" as "relative",
  },
};

// Sorted
export type Anchor = "top-left" | "top-right" | "bottom-right" | "bottom-left";
const anchors: Anchor[] = [
  "top-left",
  "top-right",
  "bottom-right",
  "bottom-left",
];

// 4x4 matrix
export type Matrix3d = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

// top-left, top-right, bottom-right, bottom-left
export type RectPoints = [Vector, Vector, Vector, Vector];

export type Vector = [number, number]; // [x, y]

const defaultMatrix: Matrix3d = [
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1, // second and third for x and y position of element
];

const _setDeltaVal = () => {
  let deltaInitVals: any = {};
  anchors.forEach((e) => {
    deltaInitVals[e] = [0, 0];
  });
  return deltaInitVals;
};

export default class Keystoner extends React.Component<Props, State> {
  container: HTMLElement | undefined | null;
  layerTranslateDelta: Vector | undefined;
  anchorTranslateDelta: Vector | undefined;
  isAnchorDragging = false;
  targetPoints: RectPoints | any;
  anchorMoving: Anchor | undefined;
  state: State = {
    matrix: defaultMatrix,
    translateDelta: _setDeltaVal(),
    sourcePoints: undefined,
    transformOrigin: [0, 0],
    containerTranslate: [this.props.x || 0, this.props.y || 0],
  };

  componentDidMount() {
    window.addEventListener("mousemove", this.onAnchorMouseMove);
    window.addEventListener("mousemove", this.onMouseMove);
    if (this.container) {
      const { width, height } = this.container.getBoundingClientRect();
      const marginInitialView = 0;
      const sourcePoints = [
        [marginInitialView, marginInitialView],
        [width - marginInitialView, marginInitialView],
        [width - marginInitialView, height - marginInitialView],
        [marginInitialView, height - marginInitialView],
      ] as RectPoints;
      this.targetPoints = [...sourcePoints] as RectPoints;
      this.setState({ sourcePoints });

      if (localStorage.getItem("projMap")) {
        console.log("loading prev. projMap...");
        let ls: any = localStorage.getItem("projMap");
        this.setState(JSON.parse(ls));
      }
    }
  }
  componentDidUpdate(prevProps: any, prevState: State) {
    // save whatever keystone was in state
    localStorage.setItem("projMap", JSON.stringify(prevState));
  }

  componentWillUnmount() {
    window.removeEventListener("mousemove", this.onAnchorMouseMove);
    window.removeEventListener("mousemove", this.onMouseMove);
  }

  onAnchorMouseDown = (evt: any, position: any) => {
    evt.stopPropagation();
    this.anchorTranslateDelta = [
      evt.pageX - this.state.translateDelta[position][0],
      evt.pageY - this.state.translateDelta[position][1],
    ];

    this.anchorMoving = position;
  };

  onAnchorMouseMove = (evt: any) => {
    if (
      !this.anchorTranslateDelta ||
      !this.state.sourcePoints ||
      !this.anchorMoving
    ) {
      return;
    }
    evt.preventDefault();
    evt.stopPropagation();
    const vectorIndexToModify = anchors.indexOf(this.anchorMoving);

    const deltaX = evt.pageX - this.anchorTranslateDelta[0];
    const deltaY = evt.pageY - this.anchorTranslateDelta[1];

    this.targetPoints[vectorIndexToModify] = [
      this.state.sourcePoints[vectorIndexToModify][0] + deltaX,
      this.state.sourcePoints[vectorIndexToModify][1] + deltaY,
    ];

    this.setState({
      matrix: transformPointsToMatrix(
        this.state.sourcePoints,
        this.targetPoints!
      ),
      translateDelta: {
        ...this.state.translateDelta,
        [this.anchorMoving]: [deltaX, deltaY],
      },
    });
  };

  onAnchorMouseUp = (position: any) => {
    this.anchorTranslateDelta = undefined;
    this.anchorMoving = undefined;
  };

  onMouseUp = () => {
    this.layerTranslateDelta = undefined;
  };

  onMouseMove = (evt: any) => {
    if (!this.layerTranslateDelta || !this.props.isEditMode) {
      return;
    }

    const newVector: Vector = [
      evt.pageX - this.layerTranslateDelta[0],
      evt.pageY - this.layerTranslateDelta[1],
    ];

    this.setState({
      containerTranslate: newVector,
    });
  };

  onMouseDown = (evt: any) => {
    const { containerTranslate } = this.state;
    this.layerTranslateDelta = [
      evt.pageX - containerTranslate[0],
      evt.pageY - containerTranslate[1],
    ];
  };

  render() {
    const {
      style,
      isEditMode,
      className,
      anchorStyle,
      anchorClassName,
    } = this.props;
    const {
      translateDelta,
      matrix,
      containerTranslate,
      transformOrigin,
    } = this.state;

    return (
      <>
        <div
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          style={{
            cursor: isEditMode ? "all-scroll" : "inherit",
            position: "relative",
            display: "inline-block",
            transform: vectorToTransform(containerTranslate),
          }}
        >
          <div
            ref={(ref) => {
              this.container = ref;
            }}
            style={{
              ...styles.container,
              ...style,
              pointerEvents: isEditMode ? "none" : "all",
              transform: matrixToTransform(matrix),
              transformOrigin: `${transformOrigin[0]}px ${transformOrigin[1]}px 0px`,
            }}
            className={className}
          >
            {this.props.children}
          </div>
          {isEditMode && (
            <div>
              {anchors.map((anchor, index) => (
                <AnchorComponent
                  style={anchorStyle}
                  className={anchorClassName}
                  key={anchor}
                  translation={translateDelta[anchor]}
                  position={anchor}
                  onMouseDown={this.onAnchorMouseDown}
                  onMouseUp={this.onAnchorMouseUp}
                />
              ))}
            </div>
          )}
        </div>
      </>
    );
  }
}
