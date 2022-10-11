export const createTypesArray = (LandUseTypesList) => {
  let typesArray = [];
  Object.keys(LandUseTypesList).forEach((type, index) => {
    typesArray.push({
      id: index,
      name: type,
      description: LandUseTypesList[type].description,
      color: LandUseTypesList[type].color,
      height: LandUseTypesList[type].height,
      "height[0]": LandUseTypesList[type].height
        ? LandUseTypesList[type].height[0]
        : 0,
      "height[1]": LandUseTypesList[type].height
        ? LandUseTypesList[type].height[1]
        : 0,
      "height[2]": LandUseTypesList[type].height
        ? LandUseTypesList[type].height[2]
        : 0,

      LBCS: LandUseTypesList[type].LBCS
        ? JSON.stringify(LandUseTypesList[type].LBCS)
        : null,
      NAICS: LandUseTypesList[type].NAICS
        ? JSON.stringify(LandUseTypesList[type].NAICS)
        : null,
      interactive: LandUseTypesList[type].interactive,
    });
  });
  return typesArray;
};

export const tableInitialState = [
  {
    field: "name",
    headerName: "Type Name",
    editable: true,
  },
  {
    field: "description",
    headerName: "Description",
    width: 300,
    editable: true,
  },
  {
    field: "interactive",
    headerName: "Interactive",
    type: 'boolean',
    valueOptions: [true, false],
    editable: true,
  },
  {
    field: "height[0]",
    headerName: "Height [0]",
    type: "number",
    editable: true,
  },
  {
    field: "height[1]",
    headerName: "Height [1]",
    type: "number",
    editable: true,
  },
  {
    field: "height[2]",
    headerName: "Height [2]",

    type: "number",
    editable: true,
  },

  {
    field: "color",
    headerName: "Color",
    type: "string",
    editable: true,
  },
  {
    field: "LBCS",
    type: "string",
    editable: true,
  },
  {
    field: "NAICS",
    type: "string",
  },
];
