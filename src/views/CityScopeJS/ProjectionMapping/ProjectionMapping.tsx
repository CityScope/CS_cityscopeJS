import * as React from "react";
import { AnchorComponent } from "./anchor";
import {
    matrixToTransform,
    transformPointsToMatrix,
    vectorToTransform,
} from "./util";

import DeleteLocalStorage from "./deleteLocalStorage";

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

export class ProjectionMapping extends React.Component<Props, State> {
    container: HTMLElement | null;
    layerTranslateDelta: Vector | undefined;
    anchorTranslateDelta: Vector | undefined;
    isAnchorDragging = false;
    targetPoints: RectPoints;
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
            const sourcePoints = [
                [0, 0],
                [width, 0],
                [width, height],
                [0, height],
            ] as RectPoints;

            this.targetPoints = [...sourcePoints] as RectPoints;
            this.setState({ sourcePoints });
        }
    }
    componentDidUpdate(prevProps: any, prevState: State) {
        // if entered keystone mode
        if (!prevProps.isEditMode && this.props.isEditMode) {
            // if found prev. keystone data
            if (localStorage.getItem("projMap")) {
                console.log("loading prev. projMap...");
                let ls: any = localStorage.getItem("projMap");
                this.setState(JSON.parse(ls));
            }
            // if left keystone mode
        } else if (prevProps.isEditMode && !this.props.isEditMode) {
            console.log("saving edited projMap...");
            // save whatever keystone was in state
            localStorage.setItem("projMap", JSON.stringify(prevState));
        }
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

    _clearLocalStraoge = () => {
        if (localStorage.getItem("projMap")) {
            localStorage.removeItem("projMap");
        }
        window.location.reload();
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
            <React.Fragment>
                {isEditMode && (
                    <div onClick={() => this._clearLocalStraoge()}>
                        <DeleteLocalStorage />
                    </div>
                )}

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
            </React.Fragment>
        );
    }
}
