import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
    _proccessAccessData,
    _proccessGridData,
} from "../../CityScopeJS/DeckglMap/utils/BaseMapUtils";
import { StaticMap } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import "mapbox-gl/dist/mapbox-gl.css";
import settings from "../../../settings/settings.json";
import {
    updateSunDirection,
    _setupSunEffects,
} from "../../CityScopeJS/DeckglMap/utils/EffectsUtils";
import {
    AccessLayer,
    AggregatedTripsLayer,
    ABMLayer,
    GridLayer,
} from "./deckglLayers";

export default function PrjDeckGLMap() {
    const [viewState, setViewState] = useState(settings.map.initialViewState);

    const [access, setAccess] = useState(null);
    const [GEOGRID, setGEOGRID] = useState(null);
    const [ABM, setABM] = useState({});
    const [loaded, setLoaded] = useState(false);
    const effectsRef = useRef();
    const deckGL = useRef();

    const [
        cityioData,
        sliders,
        menu,
        accessToggle,
        selectedType,
        ABMmode,
    ] = useSelector((state) => [state.CITYIO, state.SLIDERS, state.MENU]);

    useEffect(() => {
        // fix deck view rotate
        _rightClickViewRotate();
        // setup sun effects
        _setupSunEffects(effectsRef, cityioData.GEOGRID.properties.header);
        // zoom map on CS table location
        _setViewStateToTableHeader();
        setLoaded(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        effectsRef.current[0].shadowColor = [0, 0, 0, 1];
    }, []);

    useEffect(() => {
        if (!loaded) return;
        updateSunDirection(sliders.time[1], effectsRef);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sliders.time]);

    useEffect(() => {
        setGEOGRID(_proccessGridData(cityioData));

        if (cityioData.access) {
            setAccess(_proccessAccessData(cityioData));
        }

        if (cityioData.ABM2) {
            setABM(cityioData.ABM2);
        }
    }, [cityioData]);

    const onViewStateChange = ({ viewState }) => {
        setViewState(viewState);
    };

    // /**
    //  * resets the camera viewport
    //  * to cityIO header data
    //  * https://github.com/uber/deck.gl/blob/master/test/apps/viewport-transitions-flyTo/src/app.js
    //  */
    const _setViewStateToTableHeader = () => {
        const header = cityioData.GEOGRID.properties.header;

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

    // /**
    //  * Description. fix deck issue
    //  * with rotate right botton
    //  */
    const _rightClickViewRotate = () => {
        document
            .getElementById("deckgl-wrapper")
            .addEventListener("contextmenu", (evt) => evt.preventDefault());
    };

    const layersKey = {
        ABM: ABMLayer({
            data: ABM.trips,
            cityioData,
            ABMmode,
            zoomLevel: viewState.zoom,
            sliders,
        }),
        AGGREGATED_TRIPS: AggregatedTripsLayer({
            data: ABM.trips,
            cityioData,
            ABMmode,
        }),
        GRID: GridLayer({
            data: GEOGRID,
            state: {
                selectedType,
            },
            updaters: {
                setSelectedCellsState: null,
            },
            deckGL,
        }),
        ACCESS: AccessLayer({
            data: access,
            accessToggle,
        }),
    };

    const layerOrder = ["ABM", "AGGREGATED_TRIPS", "GRID", "ACCESS"];

    const _renderLayers = () => {
        let layers = [];
        for (var layer of layerOrder) {
            if (menu.includes(layer)) {
                layers.push(layersKey[layer]);
            }
        }
        return layers;
    };

    return (
        <div className="baseMap">
            <DeckGL
                ref={deckGL}
                viewState={viewState}
                onViewStateChange={onViewStateChange}
                layers={_renderLayers()}
                effects={effectsRef.current}
                controller={{
                    keyboard: false,
                }}
            >
                <StaticMap
                    asyncRender={false}
                    dragRotate={true}
                    reuseMaps={true}
                    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                    mapStyle={settings.map.mapStyle.sat}
                    preventStyleDiffing={true}
                />
            </DeckGL>
        </div>
    );
}
