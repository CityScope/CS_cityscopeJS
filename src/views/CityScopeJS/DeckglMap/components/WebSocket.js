import React, { useEffect, forwardRef } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

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
        console.log(socket);
        props.onChange(null, null, socket);
      }
    });
    
    client.on("tableDim", (dim) => {
      if (wsON) {
        console.log(dim);
        props.onChange(null, null, dim);
      }
    });
    
    client.on("roboscopeInput", (data) => {
      if (props.GEOGRID!=null) {
        let dataProps = props.GEOGRID; 
        for (let i = 0; i < data.length; i++) {
          dataProps.features[data[i].id].properties = data[i]
        }
        props.onChange(dataProps, data);
      }
    });
  }, [props.GEOGRID, wsON]);

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
              top: 45,
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
            <Typography style={{ paddingTop: "5px", marginRight: "10px", fontSize:"14px"}}>
                Websockets Connected
            </Typography>
            <CircularProgress size={25}/>
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