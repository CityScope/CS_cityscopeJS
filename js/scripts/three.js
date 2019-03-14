/////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * makes the initial 3js grid of meshes and texts
 * @param sizeX, sizeY of grid
 */
export function create_threeJS_grid_form_cityIO() {
  let cityIOdata = Storage.cityIOdata;
  //build threejs initial grid on load

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

  for (var this_row = 0; this_row < grid_rows; this_row++) {
    for (var this_column = 0; this_column < grid_columns; this_column++) {
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
        this_column * -cell_size_in_meters,
        this_row * cell_size_in_meters,
        0
      );
      three_grid_group.add(this_mesh);
    }
  }
  // very bad!! using hardcode rotation
  three_grid_group.rotation.setFromVector3(
    new THREE.Vector3(0, 0, grid_rotation_for_table)
  );

  // adds this groups to storage for later updates
  Storage.threeGrid = three_grid_group;
  return [three_grid_group];
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

function degree_to_rads(angle) {
  return angle * (Math.PI / 180);
}
