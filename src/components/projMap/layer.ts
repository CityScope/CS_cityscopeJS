import React, { Component } from "react";
import { AnchorComponent } from "./anchor";
import {
    matrixToTransform,
    transformPointsToMatrix,
    vectorToTransform
} from "./util";

// Component interfaces
export interface Props {
    style?: React.CSSProperties;
    className?: string;
    isEditMode?: boolean;
    x?: number;
    y?: number;
    anchorStyle?: React.CSSProperties;
    anchorClassName?: string;
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
        position: "relative" as "relative"
    }
};

// Sorted
export type Anchor = "top-left" | "top-right" | "bottom-right" | "bottom-left";
const anchors: Anchor[] = [
    "top-left",
    "top-right",
    "bottom-right",
    "bottom-left"
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
    1 // second and third for x and y position of element
];

export class Layer extends Component {
    container: HTMLElement | null;

    layerTranslateDelta: Vector | undefined;
    anchorTranslateDelta: Vector | undefined;

    isAnchorDragging = false;

    targetPoints: RectPoints;
    anchorMoving: Anchor | undefined;

    state: State = {
        matrix: defaultMatrix,
        translateDelta: anchors.reduce(
            (acc, key) => ((acc[key] = [0, 0]), acc),
            {}
        ),
        sourcePoints: undefined,
        transformOrigin: [0, 0],
        containerTranslate: [this.props.x || 0, this.props.y || 0]
    };

    componentWillMount() {
        window.addEventListener("mousemove", this.onAnchorMouseMove);
        window.addEventListener("mousemove", this.onMouseMove);
    }

    componentDidMount() {
        if (this.container) {
            const { width, height } = this.container.getBoundingClientRect();

            const sourcePoints = [
                [0, 0],
                [width, 0],
                [width, height],
                [0, height]
            ] as RectPoints;

            this.targetPoints = [...sourcePoints] as RectPoints;
            this.setState({ sourcePoints });
        } else {
            throw new Error(
                "Couldn't get a reference of the container element"
            );
        }
    }

    componentWillUnmount() {
        window.removeEventListener("mousemove", this.onAnchorMouseMove);
        window.removeEventListener("mousemove", this.onMouseMove);
    }

    onAnchorMouseDown = (evt, position) => {
        evt.stopPropagation();
        this.anchorTranslateDelta = [
            evt.pageX - this.state.translateDelta[position][0],
            evt.pageY - this.state.translateDelta[position][1]
        ];

        this.anchorMoving = position;
    };

    onAnchorMouseMove = evt => {
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
            this.state.sourcePoints[vectorIndexToModify][1] + deltaY
        ];

        this.setState({
            matrix: transformPointsToMatrix(
                this.state.sourcePoints,
                this.targetPoints!
            ),
            translateDelta: {
                ...this.state.translateDelta,
                [this.anchorMoving]: [deltaX, deltaY]
            }
        });
    };

    onAnchorMouseUp = position => {
        this.anchorTranslateDelta = undefined;
        this.anchorMoving = undefined;
    };

    onMouseUp = () => {
        this.layerTranslateDelta = undefined;
    };

    onMouseMove = evt => {
        if (!this.layerTranslateDelta || !this.props.isEditMode) {
            return;
        }

        const newVector: Vector = [
            evt.pageX - this.layerTranslateDelta[0],
            evt.pageY - this.layerTranslateDelta[1]
        ];

        this.setState({
            containerTranslate: newVector
        });
    };

    onMouseDown = evt => {
        const { containerTranslate } = this.state;
        this.layerTranslateDelta = [
            evt.pageX - containerTranslate[0],
            evt.pageY - containerTranslate[1]
        ];
    };

    render() {
        const {
            style,
            isEditMode,
            className,
            anchorStyle,
            anchorClassName
        } = this.props;
        const {
            translateDelta,
            matrix,
            containerTranslate,
            transformOrigin
        } = this.state;

        return (
            <div
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                style={{
                    cursor: isEditMode ? "all-scroll" : "inherit",
                    position: "relative",
                    display: "inline-block",
                    transform: vectorToTransform(containerTranslate)
                }}
            >
                <div
                    ref={ref => {
                        this.container = ref;
                    }}
                    style={{
                        ...styles.container,
                        ...style,
                        pointerEvents: isEditMode ? "none" : "all",
                        transform: matrixToTransform(matrix),
                        transformOrigin: `${transformOrigin[0]}px ${transformOrigin[1]}px 0px`
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
        );
    }
}
