import { useEffect, useState } from "react";
import {
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

export default function TypesListMenu() {
  const dispatch = useDispatch();
  const cityIOdata = useSelector((state) => state.cityIOdataState.cityIOdata);
  const typesList = cityIOdata.GEOGRID.properties.types;
  const [selectedType, setSelectedType] = useState(null);

  const [typeHeight, setTypeHeight] = useState(0);
  const heightSliderMarks = [
    { value: 0, label: "min" },
    { value: 100, label: "max" },
  ];

  const handleListItemClick = (typeProps, thisTypeName) => {
    typeProps = { ...typeProps, thisTypeName: thisTypeName };
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
        <div key={`li_types_top_div_${index}`}>
          <ListItem key={`li_menu_${index}`}>
            <Button
              fullWidth
              size="small"
              key={Math.random()}
              variant="outlined"
              sx={{
                "&.MuiButton-text": { color: { col } },
                border: "solid 1px " + col,
              }}
              onClick={() => handleListItemClick(typesList[thisType], thisType)}
            >
              <Typography color={col} variant="caption">
                {thisType}
              </Typography>
            </Button>
          </ListItem>

          {selectedType && selectedType.thisTypeName === thisType && (
            <ListItem key={`li_types_card_${index}`}>
              <Card  key={`li_types_card_${index}`} sx={{ width: "100%" }}>
                <CardContent>
                  {description && (
                    <Typography variant="caption">{description}</Typography>
                  )}

                  {selectedType && selectedType.height && (
                    <div                       key={`li_types_div_${index}`}
                    >
                      <Typography>Set Height</Typography>

                      <Slider
                      key={`li_types_slider_${index}`}
                        valueLabelDisplay="auto"
                        value={typeHeight}
                        size="small"
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
                    </div>
                  )}
                  {LBCS && (
                    <div>
                      <Typography>LBCS</Typography>
                      <Typography variant="caption">
                        {JSON.stringify(LBCS, null, "\t")}
                      </Typography>
                    </div>
                  )}
                  {NAICS && (
                    <div>
                      <Typography>NAICS</Typography>
                      <Typography variant="caption">
                        {JSON.stringify(NAICS, null, "\t")}
                      </Typography>
                    </div>
                  )}
                </CardContent>
              </Card>
            </ListItem>
          )}
        </div>
      );
    });
    return <List>{listMenuItemsArray}</List>;
  };

  return <>{createTypesIcons(typesList)}</>
}
