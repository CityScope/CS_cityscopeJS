import React from "react";
import { useDispatch } from "react-redux";
import settings from "../../../../settings/settings.json";
import List from "@material-ui/core/List";
import { StyledListItem } from "./styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import { useStyles } from "./styles";
import { listenToEditMenu } from "../../../../redux/actions";
import { connect } from "react-redux";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

const networkTypes = settings.map.netTypes;

function EditMenuMain(props) {
    const classes = useStyles();

    const theme = createMuiTheme({
        palette: {
            textPrimary: { main: "white" },
        },
        typography: {
            body1: {
                // fontFamily: '"Roboto", "sans-serif"',
                fontSize: "1em",
            },
            h5: {
                fontSize: "2em",
                fontWeight: "300",
            },
            h6: {
                fontSize: "0.5em",
                fontWeight: "700",
                textShadow: "2px 2px 2px #000",
            },
        },
    });

    const [selectedIndex, setSelectedIndex] = React.useState("");

    const dispatch = useDispatch();

    const handleListItemClick = (event, name, typeProps) => {
        setSelectedIndex(name);
        dispatch(listenToEditMenu(typeProps));
    };

    // create the types themselves
    const createTypesIcons = (LanduseTypesList) => {
        let iconsArr = [];
        Object.keys(LanduseTypesList).forEach((type) => {
            let col = LanduseTypesList[type].color;
            let rgbCol = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";

            const selected = selectedIndex === type;

            iconsArr.push(
                <StyledListItem
                    style={{
                        backgroundColor: rgbCol,
                        opacity: selected ? 0.4 : 1,
                    }}
                    key={type}
                    button
                    variant="raised"
                    selected={selected}
                    onClick={(event) =>
                        handleListItemClick(event, type, LanduseTypesList[type])
                    }
                >
                    <Typography
                        className={classes.typeName}
                        variant="h6"
                        align="center"
                    >
                        {type}
                    </Typography>
                </StyledListItem>
            );
        });
        return iconsArr;
    };

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Paper className={classes.root}>
                <Typography variant="h5" gutterBottom>
                    Land-Use
                </Typography>
                <List className={classes.list}>
                    {createTypesIcons(
                        props.cityioData.GEOGRID.properties.types
                    )}
                </List>
                <Divider />
                <Typography variant="h5" gutterBottom>
                    Mobility
                </Typography>
                <List className={classes.list}>
                    {createTypesIcons(networkTypes)}
                </List>
            </Paper>
        </MuiThemeProvider>
    );
}

// export default EditMenuMain;

const mapStateToProps = (state) => {
    return {
        cityioData: state.CITYIO,
    };
};

export default connect(mapStateToProps, null)(EditMenuMain);
