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

    if (Storage.tableExtents) {
      zoomLevelForBounds = this.map.cameraForBounds(Storage.tableExtents);

      zoomLevelForBounds = zoomLevelForBounds.zoom - 0.3;
    } else {
      zoomLevelForBounds = 5;
    }

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
