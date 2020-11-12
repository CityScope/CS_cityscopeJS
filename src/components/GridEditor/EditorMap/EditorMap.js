import React, { Component } from "react";
import EditorBrush from "./EditorBrush";
import { connect } from "react-redux";
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import "mapbox-gl/dist/mapbox-gl.css";
import { GeoJsonLayer } from "deck.gl";
import settings from "../GridEditorSettings.json";
import { listenToBaseMapCenter } from "../../../redux/actions";

export const _hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? [
              parseInt(result[1], 16),
              parseInt(result[2], 16),
              parseInt(result[3], 16),
          ]
        : null;
};

class BaseMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedType: null,
            draggingWhileEditing: false,
            selectedCellsState: null,
            pickingRadius: 40,
            viewState: settings.map.initialViewState,
        };

        this.dirLightSettings = {
            timestamp: Date.UTC(2019, 7, 1, 12),
            color: [255, 255, 255],
            intensity: 1.0,
            _shadow: true,
        };
    }

    componentDidMount() {
        // fix deck view rotate
        this._rightClickViewRotate();
     
        // zoom map on CS table location
        this._setViewStateToTableHeader();
    }

    _toggleOrthoView = (viewState) => {
        viewState.orthographic = this.props.menu.includes("RESET_VIEW")
            ? true
            : false;
    };

    _onViewStateChange = ({ viewState }) => {
        this.setState({ viewState });
    };

    componentDidUpdate = (prevProps) => {
        if (this.props.mapCenter !== prevProps.mapCenter)
            this.setState({
                viewState: {
                    ...this.state.viewState,
                    latitude: this.props.mapCenter.latCenter,
                    longitude: this.props.mapCenter.lonCenter,
                    pitch: 0,
                    bearing: 0,
                    orthographic: false,
                },
            });
    };

    /**
     * resets the camera viewport
     * to cityIO header data
     * https://github.com/uber/deck.gl/blob/master/test/apps/viewport-transitions-flyTo/src/app.js
     */
    _setViewStateToTableHeader() {
        this.setState({
            viewState: {
                ...this.state.viewState,
                latitude: settings.GEOGRID.properties.header.latitude,
                longitude: settings.GEOGRID.properties.header.longitude,
                zoom: 15,
                pitch: 0,
                bearing: 0,
                orthographic: true,
            },
        });
    }

   
    /**
     * Description. fix deck issue
     * with rotate right botton
     */
    _rightClickViewRotate() {
        document
            .getElementById("deckgl-wrapper")
            .addEventListener("contextmenu", (evt) => evt.preventDefault());
    }

    /**
     * Description. uses deck api to
     * collect objects in a region
     * @argument{object} e  picking event
     */
    _mulipleObjPicked = (e) => {
        const dim = this.state.pickingRadius;
        const x = e.x - dim / 2;
        const y = e.y - dim / 2;
        let mulipleObj = this.deckGL.pickObjects({
            x: x,
            y: y,
            width: dim,
            height: dim,
        });
        return mulipleObj;
    };

    /**
     * Description. allow only to pick cells that are
     *  not of CityScope TUI & that are interactable
     * so to not overlap TUI activity
     */
    _handleGridcellEditing = (e) => {
        if (!this.props.selectedType) return;
        const { height, name, color, interactive } = this.props.selectedType;
        const multiSelectedObj = this._mulipleObjPicked(e);

        multiSelectedObj.forEach((selected) => {
            let thisCellProps = selected.object.properties;
            thisCellProps.color = _hexToRgb(color);
            thisCellProps.height = parseInt(height);
            thisCellProps.name = name;
            if (interactive !== "No") {
                thisCellProps.interactive = interactive;
            } else {
                delete thisCellProps.interactive;
            }
        });
        this.setState({
            selectedCellsState: multiSelectedObj,
        });
    };

    /**
     * Description.
     * draw target area around mouse
     */
    _renderSelectionTarget = () => {
        return (
            this.props.selectedType && (
                <EditorBrush
                    mousePos={this.state.mousePos}
                    selectedType={this.props.selectedType}
                    divSize={this.state.pickingRadius}
                    mouseDown={this.state.mouseDown}
                />
            )
        );
    };

    _handleKeyUp = () => {
        this.setState({ keyDownState: null });
    };

    _handleKeyDown = (e) => {
        // avoid common clicks
        this.setState({ keyDownState: e.nativeEvent.key });
    };

    /**
     * renders deck gl layers
     */
    _renderLayers() {
        let layers = [];
        layers.push(
            new GeoJsonLayer({
                id: "GRID",
                opacity: 0.5,
                stroked: false,
                filled: true,
                wireframe: true,
                data: this.props.createdGrid,
                visible: true,
                pickable: true,
                extruded: true,
                lineWidthScale: 1,
                lineWidthMinPixels: 1,
                getElevation: (d) => d.properties.height,
                getFillColor: (d) => d.properties.color,

                onClick: (event, cellInfo) => {
                    if (
                        !cellInfo.rightButton &&
                        this.state.keyDownState !== "Shift"
                    )
                        this._handleGridcellEditing(event);
                },

                onDrag: (event, cellInfo) => {
                    if (
                        !cellInfo.rightButton &&
                        this.state.keyDownState !== "Shift"
                    )
                        this._handleGridcellEditing(event);
                },
                onDragStart: (event, cellInfo) => {
                    if (
                        !cellInfo.rightButton &&
                        this.state.keyDownState !== "Shift"
                    ) {
                        this.setState({ draggingWhileEditing: true });
                    }
                },
                onDragEnd: () => {
                    this.setState({ draggingWhileEditing: false });
                },
                updateTriggers: {
                    getFillColor: this.state.selectedCellsState,
                    getElevation: this.state.selectedCellsState,
                },
                transitions: {
                    getFillColor: 500,
                    getElevation: 500,
                },
            })
        );

        return layers;
    }

    render() {
        return (
            <div
                className="baseMap"
                onKeyDown={this._handleKeyDown}
                onKeyUp={this._handleKeyUp}
                onMouseMove={(e) =>
                    this.setState({
                        mousePos: e.nativeEvent,
                    })
                }
                onMouseUp={() =>
                    this.setState({
                        mouseDown: false,
                    })
                }
                onMouseDown={() =>
                    this.setState({
                        mouseDown: true,
                    })
                }
            >
                {this._renderSelectionTarget()}

                <DeckGL
                    // sets the cursor on paint
                    // getCursor={() => "none"}
                    ref={(ref) => {
                        // save a reference to the Deck instance
                        this.deckGL = ref && ref.deck;
                    }}
                    viewState={this.state.viewState}
                    onViewStateChange={this._onViewStateChange}
                    layers={this._renderLayers()}
                    controller={{
                        touchZoom: true,
                        touchRotate: true,
                        dragPan: !this.state.draggingWhileEditing,
                        dragRotate: !this.state.draggingWhileEditing,
                        keyboard: false,
                    }}
                >
                    <StaticMap
                        dragRotate={true}
                        reuseMaps={true}
                        mapboxApiAccessToken={
                            process.env.REACT_APP_MAPBOX_TOKEN
                        }
                        mapStyle={settings.map.mapStyle.sat}
                        preventStyleDiffing={true}
                    />
                </DeckGL>
            </div>
        );
    }
}

const mapDispatchToProps = {
    listenToBaseMapCenter: listenToBaseMapCenter,
};

const mapStateToProps = (state) => {
    return {
        selectedType: state.ROW_EDIT,
        mapCenter: state.BASE_MAP_CENTER,
        createdGrid: state.GRID_CREATED,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BaseMap);
