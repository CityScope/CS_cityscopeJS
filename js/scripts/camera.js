import "./Storage";
export class Camera {
  constructor(map) {
    this.map = Storage.map;
    this.cityIOdata = Storage.cityIOdata;
    this.tableExtents = Storage.tableExtents;
  }

  // getLatLon() {
  //   this.map.on("mousedown", function(e) {
  //     console.log(e.lngLat);
  //   });
  // }

  reset_camera_position() {
    let angle;
    angle = 180 - this.cityIOdata.header.spatial.rotation;
    this.map.rotateTo(angle, { duration: 200 });
    this.map.flyTo({
      center: this.findTableCenter(),
      bearing: angle,
      pitch: 0,
      zoom: 15.5
    });
  }

  findTableCenter() {
    let pnts = [
      Math.abs(this.tableExtents[2][0] - this.tableExtents[0][0]),
      Math.abs(this.tableExtents[2][1] - this.tableExtents[0][1])
    ];
    var dist = 0.5 * Math.sqrt(pnts[0] * pnts[0] + pnts[1] * pnts[1]);
    console.log(dist);
    return [this.tableExtents[2][0] - dist, this.tableExtents[2][1] + dist];
  }
}

// cant call inside class
export function rotateCamera(timestamp) {
  Storage.map.rotateTo((timestamp / 300) % 360, { duration: 0 });
  Storage.reqAnimFrame = requestAnimationFrame(rotateCamera);
}
