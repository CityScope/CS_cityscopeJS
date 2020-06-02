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
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

function EditMenu(props) {
    const useStyles = makeStyles({
        drawer: {
            background: "#1D1F21",
            width: 300,
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
    });

    const classes = useStyles();
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const dispatch = useDispatch();
    const selectedType = useSelector((state) => state.SELECTED_TYPE);
    const { height } = selectedType;
    const marks = [
        { value: 0, label: "0" },
        { value: 50, label: "50" },
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
                <React.Fragment key={Math.random()}>
                    <Divider
                        key={Math.random()}
                        variant="inset"
                        component="li"
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
                        <ListItemAvatar>
                            <Avatar style={{ backgroundColor: rgbCol }}>
                                {type.charAt(0)}
                            </Avatar>
                        </ListItemAvatar>

                        <ListItemText
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

                    <Collapse in={selected}>
                        <ListItem key={Math.random()}>
                            <Slider
                                value={height}
                                valueLabelDisplay="auto"
                                className={classes.list}
                                onChange={(event, value) =>
                                    dispatch(
                                        listenToEditMenu({
                                            ...selectedType,
                                            height: value,
                                        })
                                    )
                                }
                                aria-labelledby="Floors"
                                getAriaLabel={(index) => index.toString()}
                                min={0}
                                max={50}
                                marks={marks}
                            ></Slider>
                        </ListItem>
                    </Collapse>
                </React.Fragment>
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
