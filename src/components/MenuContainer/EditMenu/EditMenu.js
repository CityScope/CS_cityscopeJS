import React from "react";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import { useSelector, useDispatch } from "react-redux";
import List from "@material-ui/core/List";
import Collapse from "@material-ui/core/Collapse";
import { listenToEditMenu } from "../../../redux/actions";
import { connect } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

function EditMenu(props) {
    const muiTheme = createMuiTheme({
        overrides: {
            MuiSlider: {
                thumb: {
                    color: "#FFF5",
                },
                track: {
                    color: "white",
                },
                rail: {
                    color: "white",
                },

                markActive: {
                    color: "white",
                },
                markLabelActive: {
                    color: "white",
                },
                markLabel: {
                    color: "white",
                },
            },
        },
    });

    const useStyles = makeStyles((theme) => ({
        drawer: {
            background: "#1D1F21",
            width: 300,

            zIndex: theme.zIndex.drawer + 1,
        },
        listItemPrimaryText: {
            color: "#FFF",
        },
        listItemSecondaryText: {
            color: "#999",
            fontSize: "0.7em",
        },
        list: {
            color: "#999",
        },

        dividerColor: {
            backgroundColor: "#484848",
        },
    }));

    const classes = useStyles();
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const dispatch = useDispatch();
    const selectedType = useSelector((state) => state.SELECTED_TYPE);
    const { height } = selectedType;
    const marks = [
        { value: 0, label: "0 floors" },
        { value: 50, label: "50 floors" },
    ];

    const handleListItemClick = (event, name, typeProps) => {
        // ! injects the type name into the attributes themselves
        typeProps.name = name;
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
            let use;
            LanduseTypesList[type].LBCS.forEach((lbcs) => {
                use = Object.keys(lbcs.use)[0];
            });

            iconsArr.push(
                <ThemeProvider key={Math.random()} theme={muiTheme}>
                    <Divider
                        key={Math.random()}
                        variant="inset"
                        component="li"
                        classes={{ root: classes.dividerColor }}
                    />

                    <ListItem
                        key={Math.random()}
                        alignItems="flex-start"
                        button
                        variant="raised"
                        selected={selected}
                        onClick={(event) =>
                            handleListItemClick(
                                event,
                                type,
                                LanduseTypesList[type]
                            )
                        }
                        className={classes.list}
                    >
                        <ListItemAvatar key={Math.random()}>
                            <Avatar style={{ backgroundColor: rgbCol }}>
                                {type.charAt(0)}
                            </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                            key={Math.random()}
                            classes={{
                                primary: classes.listItemPrimaryText,
                                secondary: classes.listItemSecondaryText,
                            }}
                            primary={type}
                            secondary={
                                <React.Fragment>
                                    {"LBCS: " + use}
                                </React.Fragment>
                            }
                        />
                    </ListItem>

                    <Collapse in={selected} key={Math.random()}>
                        <Box m={2} width={0.8} key={Math.random()}>
                            <Slider
                                key={Math.random()}
                                value={height}
                                valueLabelDisplay="auto"
                                className={classes.list}
                                onChangeCommitted={(event, value) =>
                                    dispatch(
                                        listenToEditMenu({
                                            ...selectedType,
                                            height: value,
                                        })
                                    )
                                }
                                getAriaLabel={(index) => index.toString()}
                                min={0}
                                max={50}
                                marks={marks}
                            ></Slider>
                        </Box>
                    </Collapse>
                </ThemeProvider>
            );
        });
        return iconsArr;
    };

    return (
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="right"
            open={true}
            classes={{
                paper: classes.drawer,
            }}
        >
            <List>
                {createTypesIcons(props.cityioData.GEOGRID.properties.types)}
            </List>
        </Drawer>
    );
}

// export default EditMenuMain;

const mapStateToProps = (state) => {
    return {
        cityioData: state.CITYIO,
    };
};

export default connect(mapStateToProps, null)(EditMenu);
