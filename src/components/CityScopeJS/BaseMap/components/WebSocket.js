import React, { Component } from "react";
import io from "socket.io-client";

class WebSocket extends Component {
  constructor(props) {
      super(props);
      this.state = {
        websocketState: false,
      };
  }
  
  componentWillMount() {
    this.ioClient = io.connect("http://127.0.0.1:8080/");
  }
  
  componentDidMount() {
    let prev_state = this.state.websocketState;
    this.ioClient.on("welcome", (socket) => {
      console.log(socket);
      if (prev_state === false) {
        this.setState({ websocketState: true });
        this.ioClient.emit("onInit", this.props.GEOGRID.features, this.props.GEOGRID.properties);
      }
      console.log("updating cityio init")
    });
    
    this.ioClient.on("roboscopeInput", (data) => {
      let dataProps = this.props.GEOGRID; 
      for (let i = 0; i < data.length; i++) {
        dataProps.features[data[i].id].properties = data[i]
      }
      this.props.onChange(dataProps);
    });
    
    this.ioClient.on("waveTest", (data) => {
      let dataProps = this.props.GEOGRID; 
      for (let i = 0; i < data.length; i++) {
        dataProps.features[data[i].id].properties = data[i]
      } 
      this.props.onChange(dataProps);  
    });
  }
  
  _onGridUpdate = (pack) => {
    this.ioClient.emit("pixelUpdate", pack);
  }
  
  _onGridDUpdate = (scale, data) => {
    this.ioClient.emit("gridUpdate", scale, data);
  }
  
  render() {
    return <span />;
  }
}

export default WebSocket;
