import { useState, useMemo } from "react";
import {
  List,
  Slider,
  Typography,
  CardContent,
  Card,
  Button,
} from "@mui/material";

export default function TypesListMenu(props) {
  const { cityIOdata, getSelectedTypeFromMenu } = props;
  const typesList = cityIOdata.GEOGRID.properties.types;
  const [selectedType, setSelectedType] = useState(null);
  const [typeHeight, setTypeHeight] = useState(0);

  const heightSliderMarks = [
    { value: 0, label: "min" },
    { value: 100, label: "max" },
  ];

  useMemo(() => {
    selectedType && getSelectedTypeFromMenu(selectedType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

  const handleListItemClick = (typeProps) => {
    console.log(typeProps);
    // ! injects the type name into the attributes themselves

    if (typeHeight && typeProps.height) {
      typeProps = { ...typeProps, height: typeHeight };
    }
    setSelectedType(typeProps);
  };

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
          key={Math.random()}
          variant="outlined"
          // color={col}
          onClick={() => handleListItemClick(typesList[thisType])}
        >
          <Typography variant="caption">{thisType}</Typography>
        </Button>
      );
    });
    return <List>{listMenuItemsArray}</List>;
  };

  const typesListComps = createTypesIcons(typesList);
  return (
    <>
      {selectedType && (
        <Card elevation={15}>
          <CardContent>
            <Typography>{selectedType.name}</Typography>
            {description && (
              <Typography variant="caption">{description}</Typography>
            )}

            {selectedType && selectedType.height && (
              <>
                <Typography gutterBottom>Set Type Height</Typography>

                <Slider
                  value={typeHeight}
                  defaultValue={0}
                  valueLabelDisplay="auto"
                  onChange={(e, val) => setTypeHeight(val)}
                  onMouseUp={() =>
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
      )}

      {typesListComps}
    </>
  );
}
