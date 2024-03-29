import { useState } from "react";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { GridEditorSettings } from "../../../../settings/settings";
import { cityIOSettings } from "../../../../settings/settings";
import {Typography, List, ListItem} from "@mui/material";
import { useSelector } from "react-redux";
import Link from "@mui/material/Link";
import LoadingButton from "@mui/lab/LoadingButton";

const reqResponseUI = (response, tableName) => {
  let cityscopeJSendpoint =
    "https://cityscope.media.mit.edu/CS_cityscopeJS/?cityscope=" + tableName;
  // create the feedback text
  let resText = (
    <Typography color="textPrimary" variant="caption">
      CityIO is {response.data.status}. Grid deployed to{" "}
      <Link color="textSecondary" href={cityscopeJSendpoint}>
        {cityscopeJSendpoint}
      </Link>
    </Typography>
  );
  return resText;
};

const makeGEOGRIDobject = (struct, typesList, geoJsonFeatures, gridProps) => {
  let GEOGRIDObject = { ...struct };

  // take types list and prepare to csJS format
  let newTypesList = {};
  typesList.forEach((oldType) => {
    newTypesList[oldType.name] = { ...oldType };
    //material-table creates strings for these items
    // so in first "Commit to cityIO", these must be turned into
    // Json objects. On Second commit, these are already objects,
    // hence the two conditions below
    newTypesList[oldType.name].LBCS =
      typeof oldType.LBCS === "string"
        ? JSON.parse(oldType.LBCS)
        : oldType.LBCS;
    newTypesList[oldType.name].NAICS =
      typeof oldType.NAICS === "string"
        ? JSON.parse(oldType.NAICS)
        : oldType.NAICS;
  });

  GEOGRIDObject.properties.types = newTypesList;
  // inject table props to grid
  GEOGRIDObject.properties.header = { ...gridProps };

  const toFloatArray = [
    "longitude",
    "latitude",
    "rotation",
    "nrows",
    "ncols",
    "cellSize",
  ];
  toFloatArray.forEach((element) => {
    GEOGRIDObject.properties.header[element] = parseFloat(
      GEOGRIDObject.properties.header[element]
    );
  });

  // lastly get the grid features
  GEOGRIDObject.features = geoJsonFeatures;
  return GEOGRIDObject;
};

const makeGEOGRIDDATAobject = (geoJsonFeatures) => {
  let GEOGRIDDATA_object = [];
  geoJsonFeatures.forEach((element) => {
    GEOGRIDDATA_object.push(element.properties);
  });
  return GEOGRIDDATA_object;
};

export default function CommitGridMenu() {
  const [loading, setLoading] = useState(false);
  const [reqResponse, setReqResponse] = useState();
  const gridProps = useSelector((state) => state.editorMenuState.gridProps);
  const typesList = useSelector(
    (state) => state.editorMenuState.typesEditorState.tableData
  );

  const generatedGrid = useSelector((state) => state.editorMenuState.gridMaker);
  const generatedGridBool =
    generatedGrid &&
    generatedGrid.features &&
    generatedGrid.features.length > 0;

  const postGridToCityIO = () => {
    let GEOGRIDStructure = GridEditorSettings.GEOGRID;
    let geoJsonFeatures = generatedGrid.features;
    // take grid struct from settings
    let GEOGRIDObject = makeGEOGRIDobject(
      GEOGRIDStructure,
      typesList,
      geoJsonFeatures,
      gridProps
    );

    let GEOGRIDDATAObject = makeGEOGRIDDATAobject(geoJsonFeatures);
    let tableName = GEOGRIDObject.properties.header.tableName.toLowerCase();

    // post to cityIO server
    const gridPOSToptions = (URL, DATA) => {
      return {
        method: "post",
        url: URL,
        data: DATA,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
    };

    const table_url = `${cityIOSettings.cityIO.baseURL}table/${tableName}/`;
    const new_table_grid = {
      GEOGRID: GEOGRIDObject,
      GEOGRIDDATA: GEOGRIDDATAObject,
    };

    axios(gridPOSToptions(table_url, new_table_grid))
      .then(function (response) {
        setReqResponse(reqResponseUI(response, tableName));
      })
      .catch((error) => console.log(`ERROR: ${error}`));
  };

  return (
    <List>
      <ListItem>
        <Typography variant="h4">4. Commit Grid to cityIO</Typography>
      </ListItem>
    
        {generatedGridBool && (
          <>
            <LoadingButton
              onClick={() => {
                setLoading(true);
                new Promise((resolve) => {
                  setTimeout(() => {
                    setLoading(false);
                    postGridToCityIO();
                  }, 1500);
                  resolve();
                });
              }}
              loading={loading}
              fullWidth
              loadingPosition="start"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
            >
              Upload
            </LoadingButton>

            <div style={{ width: "100%" }}> {reqResponse}</div>
          </>
        )}
    
    </List>
  );
}
