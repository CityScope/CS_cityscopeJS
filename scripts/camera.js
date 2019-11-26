import "./Storage";

export class Camera {
  constructor() {
    this.storageCameraParams = JSON.parse(localStorage.getItem("cameraParams"));
    this.map = Storage.map;
    this.table_lat = Storage.cityioHeader.spatial.latitude;
    this.table_lon = Storage.cityioHeader.spatial.longitude;
  }

  async reset_camera_position() {
    if (
      this.storageCameraParams != null &&
      Storage.cityIOurl == this.storageCameraParams.url
    ) {
      this.map.flyTo({
        center: this.storageCameraParams.center,
        bearing: this.storageCameraParams.bearing,
        pitch: this.storageCameraParams.pitch,
        zoom: this.storageCameraParams.zoom
      });
      return;
    }

    let angle;
    angle = 360 - Storage.cityioHeader.spatial.rotation;

    this.map.rotateTo(angle);
    this.map.flyTo({
      center: [this.table_lon, this.table_lat],
      bearing: angle,
      pitch: 0,
      zoom: 14,
      speed: 5
    });
  }
}

// cant call inside class
export function rotateCamera(timestamp) {
  Storage.map.rotateTo((timestamp / 500) % 360, { duration: 0 });
  Storage.cameraRotationAnimFrame = requestAnimationFrame(rotateCamera);
}
