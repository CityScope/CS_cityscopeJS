import "./Storage";

export class Camera {
  constructor(map) {
    this.map = Storage.map;
    this.cityIOdata = Storage.cityIOdata;
    let table_lat = this.cityIOdata.header.spatial.latitude;
    let table_lon = this.cityIOdata.header.spatial.longitude;
    this.scence_origin_position = [table_lat, table_lon, 0];
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

  reset_camera_position(bool) {
    let angle;
    if (bool) {
      angle = -this.cityIOdata.header.spatial.rotation;
      // clamp the rotation between 0 -360 degrees
      // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
      this.map.rotateTo(angle, { duration: 200 });

      //   /*
      this.map.flyTo({
        center: this.find_middle_of_model(-600, 1300),
        bearing: angle,
        pitch: 0,
        zoom: 15
      });
      //   */
    } else {
      angle = 0;
      this.map.rotateTo(angle, { duration: 200 });
    }
  }

  find_middle_of_model(offest_east, offest_north) {
    //Earth’s radius, sphere
    let earth_radius = 6378137;
    //Coordinate offsets in radians
    let dLat = offest_north / earth_radius;
    let dLon =
      offest_east /
      (earth_radius *
        Math.cos((Math.PI * this.scence_origin_position[0]) / 180));
    //OffsetPosition, decimal degrees
    let latO = this.scence_origin_position[0] + (dLat * 180) / Math.PI;
    let lonO = this.scence_origin_position[1] + (dLon * 180) / Math.PI;
    return [latO, lonO];
  }
}

export function cameraControl() {
  const cam = new Camera(Storage.map);
  cam.getLatLon();
  cam.reset_camera_position(0);
  //bring map to projection postion
  document
    .getElementById("listing-group")
    .addEventListener("change", function(e) {
      if (e.target.checked) {
        // Start the animation
        cam.reset_camera_position(true);
      } else {
        // Start the animation.
        // converted 35deg to radians in an ugly way
        cam.reset_camera_position(false);
      }
    });
}
