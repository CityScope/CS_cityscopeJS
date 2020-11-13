import React from "react";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import { useSelector, useDispatch } from "react-redux";
import List from "@material-ui/core/List";
import Collapse from "@material-ui/core/Collapse";
import { listenToEditMenu } from "../../../../redux/actions";
import { connect } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { testHex, hexToRgb } from "../../BaseMap/utils/BaseMapUtils";
import TypeInfo from "./TypeInfo";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

function EditMenu(props) {
    const useStyles = makeStyles((theme) => ({
        drawer: {
            width: 250,
            zIndex: theme.zIndex.drawer + 1,
        },
        paper: {
            display: "flex",
            "& > *": {
                padding: theme.spacing(5),
            },
        },

        marginAutoContainer: {
            width: "100%",
            display: "flex",
        },
        marginAutoItem: {
            margin: "auto",
            width: "90%",
        },
    }));

    const classes = useStyles();
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const dispatch = useDispatch();
    let selectedType = useSelector((state) => state.SELECTED_TYPE);
    const height = selectedType ? selectedType.height : null;

    const marks = [
        { value: 0, label: "min" },
        { value: 100, label: "max" },
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
            let LBCS = props.cityioData.GEOGRID.properties.types[type].LBCS;
            let NAICS = props.cityioData.GEOGRID.properties.types[type].NAICS;
            if (testHex(col)) {
                col = hexToRgb(col);
            }
            let rgbCol = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")";
            const selected = selectedIndex === type;
            let typeHasHeightProps = false;
            if (LanduseTypesList[type].height) {
                typeHasHeightProps = true;
            }

            iconsArr.push(
                <React.Fragment key={Math.random()}>
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
                        />
                    </ListItem>

                    {typeHasHeightProps && (
                        <Collapse in={selected} key={Math.random()}>
                            <div className={classes.paper}>
                                <Paper elevation={10}>
                                    {LBCS && (
                                        <>
                                            {" "}
                                            <Typography gutterBottom>
                                                LBCS
                                            </Typography>{" "}
                                            <TypeInfo typeInfo={LBCS} />
                                        </>
                                    )}

                                    {NAICS && (
                                        <>
                                            <Typography gutterBottom>
                                                NAICS
                                            </Typography>{" "}
                                            <TypeInfo typeInfo={NAICS} />
                                        </>
                                    )}
                                    <Typography gutterBottom>
                                        Set Height
                                    </Typography>
                                    <div
                                        className={classes.marginAutoContainer}
                                    >
                                        <div className={classes.marginAutoItem}>
                                            <Slider
                                                key={Math.random()}
                                                value={height}
                                                valueLabelDisplay="auto"
                                                className={classes.slider}
                                                onChangeCommitted={(
                                                    event,
                                                    value
                                                ) =>
                                                    dispatch(
                                                        listenToEditMenu({
                                                            ...selectedType,
                                                            height: value,
                                                        })
                                                    )
                                                }
                                                getAriaLabel={(index) =>
                                                    index.toString()
                                                }
                                                min={marks[0].value}
                                                max={marks[1].value}
                                                marks={marks}
                                            ></Slider>
                                        </div>
                                    </div>
                                </Paper>
                            </div>
                        </Collapse>
                    )}
                </React.Fragment>
            );
        });
        return <List>{iconsArr}</List>;
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
            {createTypesIcons(props.cityioData.GEOGRID.properties.types)}
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
