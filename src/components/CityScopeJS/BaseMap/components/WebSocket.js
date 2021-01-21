import React, { useState, useEffect, forwardRef } from "react";
import BounceLoader from "react-spinners/BounceLoader";
import { css } from "@emotion/core";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";

const override = css`
    display: block;
    margin: 0 auto;
    border-color: none;
`;

const client = io.connect("http://127.0.0.1:8080/");
const WebSocket = (props, ref) => {
  const menu = useSelector((state) => state.MENU);
  var wsON = menu.includes("WEBSOCKETS");
    
  useEffect(() => {
    console.log(wsON, props.GEOGRID);
    if (wsON && props.GEOGRID!=null) {
      client.connect();
      client.emit("onInit", props.GEOGRID.features, props.GEOGRID.properties);
      console.log("socket connected, onInit");
    } 
    
    if (!wsON) {
      client.disconnect();
    }
  }, [wsON, props.GEOGRID]);
  
  useEffect(() => {
    client.on("welcome", (socket) => {
      if (props.GEOGRID!=null && wsON) {
        client.emit("onInit", props.GEOGRID.features, props.GEOGRID.properties);
        console.log("socket");
      }
    });
    
    client.on("roboscopeInput", (data) => {
      let dataProps = this.props.GEOGRID; 
      for (let i = 0; i < data.length; i++) {
        dataProps.features[data[i].id].properties = data[i]
      }
      this.props.onChange(dataProps, data);
    });
    
    client.on("waveTest", (data) => {
      let dataProps = this.props.GEOGRID; 
      for (let i = 0; i < data.length; i++) {
        dataProps.features[data[i].id].properties = data[i]
      } 
      this.props.onChange(dataProps, data);  
    });
  }, [props.GEOGRID]);

  const _onPixelUpdate = (pack) => {
    client.emit("pixelUpdate", pack);
  }
  
  const _onGridDUpdate = (scale, data) => {
    client.emit("gridUpdate", scale, data);
  }
  ref.current = [_onGridDUpdate, _onPixelUpdate]
  
  let Loader = (<span/>)
  if (wsON) {
    Loader = (
      <React.Fragment>
        <div
          style={{
              position: "fixed",
              top: 50,
              right: 50,
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
          }}
      >
          <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: "3px",
                marginTop: "3px",
              }}
          >
            <Typography style={{ paddingTop: "5px", marginRight: "10px", fontSize:"13px"}}>
                Websockets Connected
            </Typography>
            <BounceLoader
                 css={override}
                 size={25}
                 color="white"
                 loading={true}
             />
          </div>
      </div>
      </React.Fragment>
    )
  }
  
  return (
    <div>
      {Loader}
    </div>
    
  );
}

export default forwardRef(WebSocket)