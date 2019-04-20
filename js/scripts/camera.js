import "./Storage";

export class Camera {
  constructor(map) {
    this.map = Storage.map;
  }

  getLatLon() {
    this.map.on("mousedown", function(e) {
      console.log(e.lngLat);
    });
  }

  rotateCamera(timestamp) {
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    this.map.rotateTo((timestamp / 300) % 360, { duration: 0 });
    // Request the next frame of the animation.
    requestAnimationFrame(rotateCamera);
  }

  reset_camera_position(angle) {
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    this.map.rotateTo(angle, { duration: 200 });
    if (angle !== 0)
      this.map.flyTo({
        center: find_middle_of_model(scence_origin_position, -600, 1300),
        bearing: angle,
        pitch: 0,
        zoom: 15
      });
  }

  find_middle_of_model(scence_origin_position, offest_east, offest_north) {
    //Earth’s radius, sphere
    let earth_radius = 6378137;
    //Coordinate offsets in radians
    let dLat = offest_north / earth_radius;
    let dLon =
      offest_east /
      (earth_radius * Math.cos((Math.PI * scence_origin_position[0]) / 180));
    //OffsetPosition, decimal degrees
    let latO = scence_origin_position[0] + (dLat * 180) / Math.PI;
    let lonO = scence_origin_position[1] + (dLon * 180) / Math.PI;
    return [latO, lonO];
  }
}

export function cameraControl() {
  const cam = new Camera(Storage.map);
  cam.getLatLon();
  //bring map to projection postion
  document
    .getElementById("listing-group")
    .addEventListener("change", function(e) {
      if (e.target.checked) {
        // Start the animation
        cam.reset_camera_position(0);
      } else {
        // Start the animation.
        // converted 35deg to radians in an ugly way
        cam.reset_camera_position(-cityIOdata.header.spatial.rotation);
      }
    });
}
