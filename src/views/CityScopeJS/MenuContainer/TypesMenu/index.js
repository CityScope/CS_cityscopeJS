import { useEffect, useState } from "react";
import {
  Stack,
  Slider,
  Card,
  Typography,
  ListItem,
  CardContent,
  Button,
  List,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { updateTypesMenuState } from "../../../../redux/reducers/menuSlice";
import ClickAwayListener from "@mui/material/ClickAwayListener";

export default function TypesListMenu() {
  const dispatch = useDispatch();
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const typesList = cityIOdata.GEOGRID.properties.types;
  const [selectedType, setSelectedType] = useState(null);

  const handleClickAway = () => {
    setSelectedType(null);
  };

  const [typeHeight, setTypeHeight] = useState(0);
  const heightSliderMarks = [
    { value: 0, label: "min" },
    { value: 100, label: "max" },
  ];

  const handleListItemClick = (typeProps, thisTypeName) => {
    typeProps = { ...typeProps, thisTypeName: thisTypeName };

    // ! injects the type name into the attributes themselves
    if (typeHeight && typeProps.height) {
      typeProps = { ...typeProps, height: typeHeight };
    }
    setSelectedType(typeProps);
  };

  useEffect(() => {
    dispatch(
      updateTypesMenuState({
        SELECTED_TYPE: selectedType,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

  // get the LBCS/NAICS types info
  const LBCS = selectedType && selectedType.LBCS;
  const NAICS = selectedType && selectedType.NAICS;
  // get type description text if exist
  let description =
    selectedType && selectedType.description ? selectedType.description : null;

  // create the types themselves
  const createTypesIcons = (typesList) => {
    let listMenuItemsArray = [];
    Object.keys(typesList).forEach((thisType, index) => {
      // get color
      let col = typesList[thisType].color;

      if (typeof col !== "string") {
        col =
          "rgb(" +
          typesList[thisType].color[0] +
          "," +
          typesList[thisType].color[1] +
          "," +
          typesList[thisType].color[2] +
          ")";
      }
      // check if this type has height prop
      listMenuItemsArray.push(
        <Button
          size="small"
          key={Math.random()}
          variant="outlined"
          sx={{
            "&.MuiButton-text": { color: { col } },
            border:
              selectedType && selectedType.thisTypeName == thisType
                ? "solid 3px " + col
                : "solid 1px " + col,
          }}
          onClick={() => handleListItemClick(typesList[thisType], thisType)}
        >
          <Typography color={col} variant="caption">
            {thisType}
          </Typography>
        </Button>
      );
    });
    return (
      <Stack spacing={2} direction="column">
        {listMenuItemsArray}
      </Stack>
    );
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <List>
        <ListItem>{createTypesIcons(typesList)}</ListItem>

        {selectedType && (
          <ListItem>
            <Card>
              <CardContent>
                <Typography variant="h5">
                  {selectedType.thisTypeName}
                </Typography>
                {description && (
                  <Typography variant="caption">{description}</Typography>
                )}

                {selectedType && selectedType.height && (
                  <>
                    <Typography>Set Height</Typography>

                    <Slider
                      valueLabelDisplay="auto"
                      value={typeHeight}
                      defaultValue={0}
                      onChange={(e, val) => setTypeHeight(val)}
                      onChangeCommitted={() =>
                        setSelectedType({
                          ...selectedType,
                          height: typeHeight,
                        })
                      }
                      min={heightSliderMarks[0].value}
                      max={heightSliderMarks[1].value}
                      marks={heightSliderMarks}
                    />
                  </>
                )}
                {LBCS && (
                  <>
                    <Typography>LBCS</Typography>
                    <Typography variant="caption">
                      {JSON.stringify(LBCS, null, "\t")}
                    </Typography>
                  </>
                )}
                {NAICS && (
                  <>
                    <Typography>NAICS</Typography>
                    <Typography variant="caption">
                      {JSON.stringify(NAICS, null, "\t")}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </ListItem>
        )}
      </List>
    </ClickAwayListener>
  );
}
