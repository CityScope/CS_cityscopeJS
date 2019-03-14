/////////////////////////////////////////////////////////////////////////////////////////////////////////
//TEXT OVER
function create_threeJS_text_from_cityIO(text_string, three_text_color) {
  ////////////////////////

  // cell's text
  textHolder.children[i].text = i;
  array_of_types_and_colors[cityIOdata.grid[i]].type;
  textHolder.children[i].position.z = this_cell_height + 5;

  ////////////////////////
  //adds the text gemoerty
  threebox.addAtCoordinate(
    create_threeJS_grid_form_cityIO()[1],
    scence_origin_position,
    {
      preScale: 1
    }
  );

  ////////////////////////

  // rotates the text gorup the same way
  three_text_group.rotation.setFromVector3(
    new THREE.Vector3(0, 0, grid_rotation_for_table)
  );

  Storage.threeText = three_text_group;

  ////////////////////////

  // make text over geometry cell
  let text_object = create_threeJS_text_from_cityIO("null", "black");
  text_object.name = "text";
  text_object.scale.set(0.05, 0.05, 0.05);
  text_object.position.set(
    this_mesh.position.x,
    this_mesh.position.y,
    this_mesh.position.z
  );
  three_text_group.add(text_object);

  ////////////////////////

  var three_text_object = new SpriteText2D(text_string, {
    align: textAlign.center,
    font: "50px helvetica",
    fillStyle: three_text_color,
    antialias: true
  });
  return three_text_object;
}
