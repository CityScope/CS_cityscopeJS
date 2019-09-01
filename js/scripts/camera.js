import "./Storage";

export class Camera {
  constructor(map) {
    this.map = Storage.map;
    this.cityIOdata = Storage.cityIOdata;
    this.table_lat = this.cityIOdata.header.spatial.latitude;
    this.table_lon = this.cityIOdata.header.spatial.longitude;
  }

  getLatLon() {
    this.map.on("mousedown", function(e) {
      console.log(e);
    });
  }

  reset_camera_position() {
    let zoomLevelForBounds;
    let angle;
    angle = 180 - this.cityIOdata.header.spatial.rotation;

    if (Storage.tableExtents) {
      zoomLevelForBounds = this.map.cameraForBounds(Storage.tableExtents);
      console.log(zoomLevelForBounds);

      zoomLevelForBounds = zoomLevelForBounds.zoom;
    } else {
      zoomLevelForBounds = 5;
    }

    console.log(zoomLevelForBounds);

    this.map.rotateTo(angle, { duration: 200 });
    this.map.flyTo({
      center: this.findTableCenter(),
      bearing: angle,
      pitch: 0,
      zoom: zoomLevelForBounds
    });
  }

  /**
   * findTableCenter
   * return center point pnts
   */
  findTableCenter() {
    let tableCenter = [];
    // check if this table has table extents features
    if (Storage.tableExtents) {
      tableCenter = [
        0.5 * Math.abs(Storage.tableExtents[2][0] + Storage.tableExtents[0][0]),
        0.5 * Math.abs(Storage.tableExtents[2][1] + Storage.tableExtents[0][1])
      ];
    } else {
      tableCenter = [this.table_lon, this.table_lat];
    }
    return tableCenter;
  }
}

// cant call inside class
export function rotateCamera(timestamp) {
  Storage.map.rotateTo((timestamp / 300) % 360, { duration: 0 });
  Storage.reqAnimFrame = requestAnimationFrame(rotateCamera);
}
