import { Component } from "react";

class AnimationComponent extends Component {
    constructor(props) {
        super(props);
        this.animationFrame = null;
    }

    componentWillUnmount() {
        if (this.animationFrame) {
            window.cancelAnimationFrame(this.animationFrame);
        }
    }

    componentDidMount() {
        // start ainmation/sim/roate
        this._animate();
    }

    _animate() {
        const {
            toggles: { rotateOn, ABMOn },
            state: { viewState, sliders },
            updaters: { listenToSlidersEvents, sunEffects, setViewState },
            dispatch,
        } = this.props;
        if (rotateOn) {
            let bearing = viewState.bearing ? viewState.bearing : 0;
            bearing < 360 ? (bearing += 0.05) : (bearing = 0);
            setViewState({
                ...viewState,
                bearing: bearing,
            });
        }

        if (ABMOn) {
            const time = sliders.time[1];
            const speed = sliders.speed;
            const startHour = sliders.time[0];
            const endHour = sliders.time[2];
            let t = parseInt(time) + parseInt(speed);
            if (time < startHour || time > endHour) {
                t = startHour;
            }

            dispatch(
                listenToSlidersEvents({
                    ...sliders,
                    time: [sliders.time[0], t, sliders.time[2]],
                })
            );

            // update sun position
            if (sunEffects) {
                sunEffects.updateSunDirection(t);
            }
        }
        // ! start the req animation frame
        this.animationFrame = window.requestAnimationFrame(
            this._animate.bind(this)
        );
    }

    render() {
        return null;
    }
}

export default AnimationComponent;
