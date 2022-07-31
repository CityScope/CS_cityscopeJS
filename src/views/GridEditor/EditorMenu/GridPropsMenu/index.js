import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateGridProps } from "../../../../redux/reducers/editorMenuSlice";
import { TextField, Typography, List, ListItem, Stack } from "@mui/material";
import CenterMapButton from "./CenterMapButton";
import { GridEditorSettings } from "../../../../settings/settings";

export default function GridProps() {
  const settings = GridEditorSettings;
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState({
    tableName: settings.GEOGRID.properties.header.tableName,
    latitude: settings.GEOGRID.properties.header.latitude,
    longitude: settings.GEOGRID.properties.header.longitude,
    tz: settings.GEOGRID.properties.header.tz,
    nrows: settings.GEOGRID.properties.header.nrows,
    ncols: settings.GEOGRID.properties.header.nrows,
    rotation: settings.GEOGRID.properties.header.rotation,
    cellSize: settings.GEOGRID.properties.header.cellSize,
    projection: settings.GEOGRID.properties.header.projection,
  });

  const handleFormUpdates = (event) => {
    const { id, value } = event.target;
    setFormValues({ ...formValues, [id]: value });
  };

  useEffect(() => {
    // dispatch form values to redux store
    dispatch(updateGridProps(formValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues]);

  //  get all data
  // https://stackoverflow.com/questions/56641235/react-how-to-get-values-from-material-ui-textfield-components
  return (
    <List>
      <ListItem>
        <Typography variant="h4">Project Properties</Typography>
      </ListItem>
      <ListItem>
        <TextField
          onChange={(event) => handleFormUpdates(event)}
          variant="outlined"
          id="tableName"
          label="CityScope Project Name"
          defaultValue={formValues.tableName}
        />
      </ListItem>
      <ListItem>
        <Stack direction="row" spacing={1}>
          <TextField
            onChange={(event) => handleFormUpdates(event)}
            variant="outlined"
            id="latitude"
            label="Latitude"
            defaultValue={formValues.latitude}
            type="number"
          />

          <TextField
            onChange={(event) => handleFormUpdates(event)}
            variant="outlined"
            id="longitude"
            label="Longitude"
            defaultValue={formValues.longitude}
            type="number"
          />

          <TextField
            onChange={(event) => handleFormUpdates(event)}
            variant="outlined"
            id="tz"
            label="Time Zone (GMT)"
            defaultValue={formValues.tz}
            type="number"
          />
        </Stack>
      </ListItem>
      <ListItem>
        <CenterMapButton
          mapCenter={[formValues.latitude, formValues.longitude]}
        />
      </ListItem>

      <ListItem>
        <Stack direction="row" spacing={1}>
          <TextField
            onChange={(event) => handleFormUpdates(event)}
            variant="outlined"
            id="nrows"
            label="Rows"
            defaultValue={formValues.nrows}
            type="number"
            InputProps={{
              inputProps: {
                max: 100,
                min: 0,
              },
            }}
          />

          <TextField
            onChange={(event) => handleFormUpdates(event)}
            variant="outlined"
            id="ncols"
            label="Columns"
            defaultValue={formValues.ncols}
            type="number"
            InputProps={{
              inputProps: {
                max: 100,
                min: 0,
              },
            }}
          />

          <TextField
            onChange={(event) => handleFormUpdates(event)}
            variant="outlined"
            id="rotation"
            label="Rotation (deg)"
            defaultValue={formValues.rotation}
            type="number"
            InputProps={{
              inputProps: {
                max: 360,
                min: 0,
              },
            }}
          />

          <TextField
            onChange={(event) => handleFormUpdates(event)}
            variant="outlined"
            id="cellSize"
            label="Cell Size (m^2)"
            defaultValue={formValues.cellSize}
            type="number"
            InputProps={{
              inputProps: {
                max: 1000,
                min: 1,
              },
            }}
          />
        </Stack>
      </ListItem>
      <ListItem>
        <TextField
          size="small"
          onChange={(event) => handleFormUpdates(event)}
          variant="outlined"
          id="projection"
          label="Projection"
          defaultValue={formValues.projection}
          type="string"
          helperText="Default projection should work for most CityScope cases. Find specific projections at: https://epsg.io/"
        />
      </ListItem>
    </List>
  );
}
