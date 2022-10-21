import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import DeckGL from "@deck.gl/react";
import "mapbox-gl/dist/mapbox-gl.css";
import { computeMidGridCell } from "../../../utils/utils";

export default function DeckglBase({
  layers: layers,
  draggingWhileEditing: draggingWhileEditing,
  setDeckGLRef: setDeckGLRef,
  animationTime: animationTime,
  toggleRotateCamera: toggleRotateCamera,
}) {
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const menuState = useSelector((state) => state.menuState);
  const [viewState, setViewState] = useState();
  const ref = useRef(null);

  // when ref is set, set the deckGLRef
  useEffect(() => {
    ref.current && setDeckGLRef(ref);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  const viewControlButton =
    menuState.viewSettingsMenuState.VIEW_CONTROL_BUTTONS;

  // toggle camera rotation on and off
  useEffect(() => {
    if (toggleRotateCamera && toggleRotateCamera.isOn) {
      let bearing = viewState.bearing || 0;
      bearing < 360
        ? (bearing += (animationTime / 100000000) * toggleRotateCamera.slider)
        : (bearing = 0);
      setViewState({
        ...viewState,
        bearing: bearing,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleRotateCamera, animationTime]);

  // **
  //  * resets the camera viewport
  //  * to cityIO header data
  //  * https://github.com/uber/deck.gl/blob/master/test/apps/viewport-transitions-flyTo/src/app.js
  //  *
  const setViewStateToTableHeader = () => {
    const header = cityIOdata.GEOGRID.properties.header;
    const midGrid = computeMidGridCell(cityIOdata);
    return {
      ...viewState,
      longitude: midGrid[0],
      latitude: midGrid[1],
      zoom: 15,
      pitch: 45,
      bearing: 360 - header.rotation,
      orthographic: false,
    };
  };

  useEffect(() => {
    const header = cityIOdata.GEOGRID.properties.header;
    const midGrid = computeMidGridCell(cityIOdata);

    switch (viewControlButton) {
      case "RESET_VIEW_BUTTON":
        setViewState((prevViewState) => ({
          ...prevViewState,
          longitude: midGrid[0],
          latitude: midGrid[1],
          pitch: 0,
          bearing: 0,
          orthographic: false,
        }));
        break;

      case "NORTH_VIEW_BUTTON":
        setViewState((prevViewState) => ({
          ...prevViewState,
          bearing: 360 - header.rotation,
        }));
        break;

      case "ORTHO_VIEW_BUTTON":
        setViewState((prevViewState) => ({
          ...prevViewState,
          orthographic: prevViewState.orthographic
            ? !prevViewState.orthographic
            : true,
        }));

        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewControlButton]);

  // fix deck view rotate
  useEffect(() => {
    document
      // ! a more aggressive method which prevents all right click context menu [ OLD: .getElementById("deckgl-wrapper")]
      .addEventListener("contextmenu", (evt) => evt.preventDefault());
    // zoom map on CS table location
    setViewStateToTableHeader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onViewStateChange = ({ viewState }) => {
    viewState.orthographic =
      viewControlButton === "ORTHO_VIEW_BUTTON" ? true : false;
    setViewState(viewState);
  };

  return (
    <DeckGL
      ref={ref}
      viewState={viewState}
      initialViewState={setViewStateToTableHeader()}
      onViewStateChange={onViewStateChange}
      layers={layers}
      controller={{
        touchZoom: true,
        touchRotate: true,
        dragPan: !draggingWhileEditing,
        dragRotate: !draggingWhileEditing,
        keyboard: false,
      }}
    />
  );
}
