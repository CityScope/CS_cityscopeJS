import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import GridMaker from "./GridMaker/GridMaker";
import CommitGrid from "./CommitGrid/CommitGrid";
import CenterMapButton from "./CenterMapButton/CenterMapButton";
import settings from "../../GridEditorSettings.json";
import Paper from "@material-ui/core/Paper";

export default function GridProps() {
    const useStyles = makeStyles((theme) => ({
        root: {
            "& .MuiTextField-root": {
                margin: theme.spacing(1),
                flexWrap: "wrap",
            },
            "& > *": {
                margin: theme.spacing(1),
            },
        },
        paper: {
            width: "100%",
        },
    }));

    const [formValues, setformValues] = React.useState({
        tableName: "CityScopeJS",
        latitude: settings.GEOGRID.properties.header.latitude,
        longitude: settings.GEOGRID.properties.header.longitude,
        nrows: settings.GEOGRID.properties.header.nrows,
        ncols: settings.GEOGRID.properties.header.nrows,
        rotation: settings.GEOGRID.properties.header.rotation,
        cellSize: settings.GEOGRID.properties.header.cellSize,
        projection: settings.GEOGRID.properties.header.projection,
    });

    const handleChangeForm = (event) => {
        const { id, value } = event.target;
        setformValues({ ...formValues, [id]: value });
    };

    const classes = useStyles();

    //  get all data
    // https://stackoverflow.com/questions/56641235/react-how-to-get-values-from-material-ui-textfield-components
    return (
        <Paper elevation={3} className={classes.paper}>
            <form className={classes.root} noValidate autoComplete="off">
                <Typography variant="h6">Grid Properties</Typography>
                <div className={classes.root}>
                    <TextField
                        onChange={(event) => handleChangeForm(event)}
                        variant="outlined"
                        className={classes.textField}
                        id="tableName"
                        label="CityScope Project Name"
                        defaultValue={formValues.tableName}
                    />
                </div>
                <div className={classes.root}>
                    <TextField
                        onChange={(event) => handleChangeForm(event)}
                        variant="outlined"
                        className={classes.textField}
                        id="latitude"
                        label="Latitude"
                        defaultValue={formValues.latitude}
                        type="number"
                    />

                    <TextField
                        onChange={(event) => handleChangeForm(event)}
                        variant="outlined"
                        className={classes.textField}
                        id="longitude"
                        label="Longitude"
                        defaultValue={formValues.longitude}
                        type="number"
                    />
                </div>
                <div className={classes.root}>
                    <CenterMapButton
                        mapCenter={[formValues.latitude, formValues.longitude]}
                    />
                </div>
                <div className={classes.root}>
                    <TextField
                        onChange={(event) => handleChangeForm(event)}
                        variant="outlined"
                        className={classes.textField}
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
                        onChange={(event) => handleChangeForm(event)}
                        variant="outlined"
                        className={classes.textField}
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
                        onChange={(event) => handleChangeForm(event)}
                        variant="outlined"
                        className={classes.textField}
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
                        onChange={(event) => handleChangeForm(event)}
                        variant="outlined"
                        className={classes.textField}
                        id="cellSize"
                        label="Cell Size (m^2)"
                        defaultValue={formValues.cellSize}
                        type="number"
                        InputProps={{
                            inputProps: {
                                max: 1000,
                                min: 0,
                            },
                        }}
                    />
                </div>
                <div className={classes.root}>
                    <TextField
                        onChange={(event) => handleChangeForm(event)}
                        variant="outlined"
                        id="projection"
                        label="Projection"
                        defaultValue={formValues.projection}
                        type="string"
                        helperText="Note: wrong projection might break app. Find the relevant projection at: https://epsg.io/"
                    />
                </div>
                <div className={classes.root}>
                    <GridMaker gridProps={formValues} />
                    <CommitGrid gridProps={formValues} />
                </div>
            </form>
        </Paper>
    );
}
