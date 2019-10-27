import "./Storage";

export class Camera {
  constructor() {
    this.map = Storage.map;
    this.table_lat = Storage.cityioHeader.spatial.latitude;
    this.table_lon = Storage.cityioHeader.spatial.longitude;
  }

  async reset_camera_position() {
    let zoomLevelForBounds;
    let angle;
    angle = 360 - Storage.cityioHeader.spatial.rotation;

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
  Storage.map.rotateTo((timestamp / 500) % 360, { duration: 0 });
  Storage.cameraRotationAnimFrame = requestAnimationFrame(rotateCamera);
}
