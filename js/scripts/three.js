import * as THREE from "THREE";
import "./Storage";
import mapboxgl from "mapbox-gl";

/**
 * makes the initial 3js grid of meshes and texts
 * @param sizeX, sizeY of grid
 */
export function create_threeJS_grid_form_cityIO() {
  let cityIOdata = Storage.cityIOdata;
  let table_lat = cityIOdata.header.spatial.latitude;
  let table_lon = cityIOdata.header.spatial.longitude;
  // parameters to ensure the model is georeferenced correctly on the map
  var modelOrigin = [table_lon, table_lat];
  var modelAltitude = 0;
  var modelRotate = [0, 0, 0];
  var modelScale = 5.41843220338983e-8;

  // transformation parameters to position, rotate and scale the 3D model onto the map
  var modelTransform = {
    translateX: mapboxgl.MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude
    ).x,
    translateY: mapboxgl.MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude
    ).y,
    translateZ: mapboxgl.MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude
    ).z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    scale: modelScale
  };

  // configuration of the custom layer for a 3D model per the CustomLayerInterface

  var threeLayer = {
    id: "CityScopeGridLayer",
    type: "custom",
    renderingMode: "3d",
    onAdd: function(map, gl) {
      this.camera = new THREE.Camera();
      this.scene = new THREE.Scene();

      // create two three.js lights to illuminate the model
      var directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(0, -70, 100).normalize();
      this.scene.add(directionalLight);

      var directionalLight2 = new THREE.DirectionalLight(0xffffff);
      directionalLight2.position.set(0, 70, 100).normalize();
      this.scene.add(directionalLight2);

      // add the grid to layer
      this.scene.add(makeGrid());
      this.map = Storage.map;

      // use the Mapbox GL JS map canvas for three.js
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.map.getCanvas(),
        context: gl,
        antialias: true
      });

      this.renderer.autoClear = false;
    },
    render: function(gl, matrix) {
      var rotationX = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(1, 0, 0),
        modelTransform.rotateX
      );
      var rotationY = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 1, 0),
        modelTransform.rotateY
      );
      var rotationZ = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 0, 1),
        modelTransform.rotateZ
      );

      var m = new THREE.Matrix4().fromArray(matrix);
      var l = new THREE.Matrix4()
        .makeTranslation(
          modelTransform.translateX,
          modelTransform.translateY,
          modelTransform.translateZ
        )
        .scale(
          new THREE.Vector3(
            modelTransform.scale,
            -modelTransform.scale,
            modelTransform.scale
          )
        )
        .multiply(rotationX)
        .multiply(rotationY)
        .multiply(rotationZ);

      this.camera.projectionMatrix.elements = matrix;
      this.camera.projectionMatrix = m.multiply(l);
      this.renderer.state.reset();
      this.renderer.render(this.scene, this.camera);
      this.map.triggerRepaint();
    }
  };
  return threeLayer;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function makeGrid() {
  let cityIOdata = Storage.cityIOdata;

  //get table dims
  var grid_columns = cityIOdata.header.spatial.ncols;
  var grid_rows = cityIOdata.header.spatial.nrows;
  var cell_size_in_meters = cityIOdata.header.spatial.cellSize;
  var cell_rescale_precentage = 0.85;
  var this_mesh = null;
  var three_grid_group = new THREE.Object3D();
  var geometry = null;
  var material = null;
  //converted 35deg to radians in an ugly way
  var grid_rotation_for_table = degree_to_rads(
    cityIOdata.header.spatial.rotation
  );
  var z_height_of_mesh = 1;
  //loop through grid rows and cols and create the grid
  for (var this_column = 0; this_column < grid_columns; this_column++) {
    for (var this_row = 0; this_row < grid_rows; this_row++) {
      geometry = new THREE.BoxBufferGeometry(
        cell_size_in_meters * cell_rescale_precentage,
        cell_size_in_meters * cell_rescale_precentage,
        z_height_of_mesh
      );
      //make material for each cell
      material = new THREE.MeshPhongMaterial({
        color: "white"
      });
      //make mesh for cell
      this_mesh = new THREE.Mesh(geometry, material);

      this_mesh.position.set(
        this_row * cell_size_in_meters,
        this_column * cell_size_in_meters,
        0
      );
      three_grid_group.add(this_mesh);
    }
  }
  three_grid_group.rotation.setFromVector3(
    new THREE.Vector3(0, 0, grid_rotation_for_table)
  );
  // adds this groups to storage for later updates
  Storage.threeGrid = three_grid_group;
  return three_grid_group;
}

function degree_to_rads(angle) {
  return angle * (Math.PI / 180);
}
