import React from "react";
import Slider from "@material-ui/core/Slider";
import { useSelector, useDispatch } from "react-redux";
import List from "@material-ui/core/List";
import {
    Collapse,
    Typography,
    CardContent,
    Box,
    Avatar,
    ListItemAvatar,
    ListItem,
    ListItemText,
    Grid,
    Card,
} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import { listenToEditMenu } from "../../../../redux/actions";
import { connect } from "react-redux";
import { testHex, hexToRgb } from "../../../../utils/utils";
import TypeInfo from "./TypeInfo";

function EditMenu(props) {
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

    const parseTypeInfo = (typeInfo) => {
        //! check type info: if string, parse, else object
        let info =
            typeof typeInfo == "string" ? JSON.parse(typeInfo) : typeInfo;
        return info;
    };

    // create the types themselves
    const createTypesIcons = (LanduseTypesList) => {
        let iconsArr = [];
        Object.keys(LanduseTypesList).forEach((type, index) => {
            // get type description if exist
            let description = LanduseTypesList[type].description
                ? LanduseTypesList[type].description
                : null;

            let col = LanduseTypesList[type].color;
            // get the LBCS/NAICS types info
            let LBCS = parseTypeInfo(
                props.cityioData.GEOGRID.properties.types[type].LBCS
            );
            let NAICS = parseTypeInfo(
                props.cityioData.GEOGRID.properties.types[type].NAICS
            );

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
                <div key={Math.random()}>
                    <ListItem
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
                    >
                        <ListItemAvatar>
                            <Avatar
                                style={{
                                    backgroundColor: rgbCol,
                                    color: "black",
                                }}
                            >
                                {type.charAt(0)}
                            </Avatar>
                        </ListItemAvatar>

                        <ListItemText primary={type} />
                    </ListItem>

                    <Collapse in={selected}>
                        <Box spacing={1} p={1} m={1}>
                            <Card elevation={15}>
                                <CardContent>
                                    <Typography variant="h5">
                                        Type Information
                                    </Typography>

                                    {description && (
                                        <Typography variant="caption">
                                            {description}
                                        </Typography>
                                    )}
                                    <Box spacing={1} p={1} m={1} />
                                    <Grid container spacing={3}>
                                        <Grid
                                            item
                                            xs={6}
                                            l={6}
                                            md={6}
                                            xl={6}
                                            container
                                        >
                                            {LBCS && (
                                                <>
                                                    <Typography variant="caption">
                                                        LBCS
                                                    </Typography>

                                                    <TypeInfo typeInfo={LBCS} />
                                                </>
                                            )}
                                        </Grid>
                                        <Grid
                                            item
                                            xs={6}
                                            l={6}
                                            md={6}
                                            xl={6}
                                            container
                                        >
                                            {NAICS && (
                                                <>
                                                    <Typography variant="caption">
                                                        NAICS
                                                    </Typography>
                                                    <TypeInfo
                                                        typeInfo={NAICS}
                                                    />
                                                </>
                                            )}
                                        </Grid>

                                        {typeHasHeightProps && (
                                            <>
                                                <Grid
                                                    item
                                                    xs={10}
                                                    l={10}
                                                    md={10}
                                                    xl={10}
                                                    container
                                                >
                                                    <Typography gutterBottom>
                                                        Set Height
                                                    </Typography>

                                                    <Slider
                                                        value={height}
                                                        valueLabelDisplay="auto"
                                                        onChange={(
                                                            event,
                                                            value
                                                        ) =>
                                                            dispatch(
                                                                listenToEditMenu(
                                                                    {
                                                                        ...selectedType,
                                                                        height: value,
                                                                    }
                                                                )
                                                            )
                                                        }
                                                        getAriaLabel={(index) =>
                                                            index.toString()
                                                        }
                                                        min={marks[0].value}
                                                        max={marks[1].value}
                                                        marks={marks}
                                                    />
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Box>
                    </Collapse>

                    <Divider />
                </div>
            );
        });
        return <List>{iconsArr}</List>;
    };

    return <>{createTypesIcons(props.cityioData.GEOGRID.properties.types)}</>;
}

const mapStateToProps = (state) => {
    return {
        cityioData: state.CITYIO,
    };
};

export default connect(mapStateToProps, null)(EditMenu);
