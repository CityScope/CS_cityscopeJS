import { useState, useLayoutEffect } from 'react'
import Slider from '@material-ui/core/Slider'
import List from '@material-ui/core/List'

import {
  Typography,
  CardContent,
  Box,
  Grid,
  Card,
  Button,
} from '@material-ui/core'
import TypeInfo from './TypeInfo'

export default function TypesListMenu(props) {
  const { cityIOdata, getSelectedTypeFromMenu } = props
  const typesList = cityIOdata.GEOGRID.properties.types
  const [selectedType, setSelectedType] = useState(null)
  const [typeHeight, setTypeHeight] = useState(null)

  const heightSliderMarks = [
    { value: 0, label: 'min' },
    { value: 100, label: 'max' },
  ]

  useLayoutEffect(() => {
    selectedType && getSelectedTypeFromMenu(selectedType)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType])

  const handleListItemClick = (typeProps) => {
    // ! injects the type name into the attributes themselves
    setSelectedType(typeProps)
  }

  const parseTypeInfo = (typeInfo) => {
    //! check type info: if string, parse, else object
    let info = typeof typeInfo == 'string' ? JSON.parse(typeInfo) : typeInfo
    return info
  }

  // get the LBCS/NAICS types info
  const LBCS = parseTypeInfo(selectedType && selectedType.LBCS)
  const NAICS = parseTypeInfo(selectedType && selectedType.NAICS)
  // get type description text if exist
  let description =
    selectedType && selectedType.description ? selectedType.description : null
  // create the types themselves
  const createTypesIcons = (typesList) => {
    let listMenuItemsArray = []
    Object.keys(typesList).forEach((thisType, index) => {
      // get color
      let col = typesList[thisType].color
      // check if this type has height prop
      listMenuItemsArray.push(
        <Button
          style={{
            margin: '0.5em',
            border: '1px solid ' + col.toString(),
          }}
          variant="outlined"
          onClick={() => handleListItemClick(typesList[thisType])}
          color="default"
        >
          {thisType}
        </Button>,
      )
    })
    return <List>{listMenuItemsArray}</List>
  }

  const typesListComps = createTypesIcons(typesList)
  return (
    <>
      {selectedType && (
        <Card elevation={15}>
          <CardContent>
            <Typography variant="h4">{selectedType.name}</Typography>

            {description && (
              <Typography variant="caption">{description}</Typography>
            )}
            <Box spacing={1} p={1} m={1} />
            <Grid container spacing={3}>
              <Grid item xs={6} l={6} md={6} xl={6} container>
                {LBCS && (
                  <>
                    <Typography variant="caption">LBCS</Typography>

                    <TypeInfo typeInfo={LBCS} />
                  </>
                )}
              </Grid>
              <Grid item xs={6} l={6} md={6} xl={6} container>
                {NAICS && (
                  <>
                    <Typography variant="caption">NAICS</Typography>
                    <TypeInfo typeInfo={NAICS} />
                  </>
                )}
              </Grid>

              <Grid item xs={10} l={10} md={10} xl={10} container>
                <Typography gutterBottom>Set Type Height</Typography>

                <Slider
                  disabled={selectedType.height ? false : true}
                  value={typeHeight}
                  defaultValue={0}
                  valueLabelDisplay="auto"
                  onChange={(e, val) => setTypeHeight(val)}
                  onMouseUp={(e, val) =>
                    setSelectedType({
                      ...selectedType,
                      height: val,
                    })
                  }
                  min={heightSliderMarks[0].value}
                  max={heightSliderMarks[1].value}
                  marks={heightSliderMarks}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {typesListComps}
    </>
  )
}
