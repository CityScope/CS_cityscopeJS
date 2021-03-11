import React, { Component } from "react";
import { connect } from "react-redux";
import PrjDeckGLMap from "./Components/PrjDeckGLMap";
import Keystoner from "./Components/Keystoner";
import DeleteLocalStorage from "./Components/deleteLocalStorage";

class Keystone extends Component {
    _clearLocalStraoge = () => {
        if (localStorage.getItem("projMap")) {
            localStorage.removeItem("projMap");
        }
        window.location.reload();
    };
    render() {
        return (
            <>
                <div onClick={() => this._clearLocalStraoge()}>
                    <DeleteLocalStorage />
                </div>

                <div
                    style={{
                        height: "100vh",
                        width: "100vw",
                        overflow: "hidden",
                    }}
                >
                    <Keystoner
                        style={{
                            height: "100vh",
                            width: "100vw",
                        }}
                        isEditMode={true}
                    >
                        <PrjDeckGLMap menu={this.props.menu} />
                    </Keystoner>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        menu: state.MENU,
    };
};

export default connect(mapStateToProps, null)(Keystone);
