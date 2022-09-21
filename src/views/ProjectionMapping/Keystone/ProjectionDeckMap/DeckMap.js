import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Map from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { mapSettings as settings } from "../../../../settings/settings";
import ViewStateInputs from "../Components/ViewStateInputs";

export default function DeckMap(props) {
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const TUIobject = cityIOdata && cityIOdata.tui;
  const header = cityIOdata.GEOGRID.properties.header;
  const viewStateEditMode = props.viewStateEditMode;
  const layers = props.layers;
  const editMode = props.editMode;

  const mapStyle = {
    active: TUIobject.MAP_STYLE.active,
    style:
      settings.map.mapStyle[TUIobject.MAP_STYLE.style] ||
      settings.map.mapStyle.blue,
  };

  const [viewState, setViewState] = useState();

  const setViewStateToTableHeader = () => {
    setViewState({
      ...viewState,
      longitude: header.longitude,
      latitude: header.latitude,
      zoom: 15,
      pitch: 0,
      bearing: 360 - header.rotation,
      orthographic: true,
    });
  };

  const deckGLref = useRef(null);

  useEffect(() => {
    // fix deck view rotate
    document
      .getElementById("deckgl-wrapper")
      .addEventListener("contextmenu", (evt) => evt.preventDefault());
    // on init, check if prev. local storage with
    // view state exist. If so, load it.
    if (localStorage.getItem("projectionViewStateStorage")) {
      console.log("loading prev. projectionViewStateStorage...");
      const vs = localStorage.getItem("projectionViewStateStorage");
      setViewState(JSON.parse(vs));
    } else {
      // zoom map on CS table location
      setViewStateToTableHeader();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onViewStateChange = ({ viewState }) => {
    //    save current view state to local storage
    localStorage.setItem(
      "projectionViewStateStorage",
      JSON.stringify(viewState)
    );
    // ! lock bearing to avoid odd rotation
    setViewState({ ...viewState, pitch: 0, orthographic: true });
  };

  return (
    <>
      <DeckGL
        ref={deckGLref}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        layers={layers}
        controller={{}}
      >
        {!editMode && (
          <Map
            active={mapStyle.active}
            width="100%"
            height="100%"
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            mapStyle={mapStyle.style}
          />
        )}
      </DeckGL>
      {viewStateEditMode && viewState && (
        <ViewStateInputs setViewState={setViewState} viewState={viewState} />
      )}
    </>
  );
}
