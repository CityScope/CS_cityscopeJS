import "./Storage";

export class Camera {
  constructor() {
    this.map = Storage.map;
    this.cityIOdata = Storage.cityIOdata;
    this.table_lat = this.cityIOdata.header.spatial.latitude;
    this.table_lon = this.cityIOdata.header.spatial.longitude;
  }

  reset_camera_position() {
    let zoomLevelForBounds;
    let angle;
    angle = 360 - this.cityIOdata.header.spatial.rotation;

    zoomLevelForBounds = 15;

    this.map.rotateTo(angle, { duration: 200 });
    this.map.jumpTo({
      center: [this.table_lon, this.table_lat],
      bearing: angle,
      pitch: 0,
      zoom: zoomLevelForBounds
    });
  }
}

// cant call inside class
export function rotateCamera(timestamp) {
  Storage.map.rotateTo((timestamp / 300) % 360, { duration: 0 });
  Storage.reqAnimFrame = requestAnimationFrame(rotateCamera);
}
