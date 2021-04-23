import React from 'react'
import Button from '@material-ui/core/Button'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import axios from 'axios'
import settings from '../../../../../settings/GridEditorSettings.json'
import globalSettings from '../../../../../settings/settings.json'
import Typography from '@material-ui/core/Typography'
import { useSelector } from 'react-redux'
import Link from '@material-ui/core/Link'

const reqResonseUI = (response, tableName) => {
  let cityscopeJSendpoint =
    'https://cityscope.media.mit.edu/CS_cityscopeJS/?cityscope=' + tableName
  // create the feedback text
  let resText = (
    <Typography color="textPrimary" variant="caption">
      CityIO is {response.data.status}. Grid deployed to{' '}
      <Link color="textSecondary" href={cityscopeJSendpoint}>
        {cityscopeJSendpoint}
      </Link>
    </Typography>
  )

  return resText
}

/**
 *
 * @param {typesList} typesList List of types form table editor
 *
 */
const makeGEOGRIDobject = (struct, typesList, geoJsonFeatures, gridProps) => {
  let GEOGRID_object = struct

  // take types list and prepare to csJS format
  let newTypesList = {}

  typesList.forEach((oldType) => {
    newTypesList[oldType.name] = oldType
    //material-table creates strings for these items
    // so in first "Commit to cityIO", these must be turned into
    // Json objects. On Second commit, these are already objects,
    // hence the two conditions below

    newTypesList[oldType.name].LBCS =
      typeof oldType.LBCS == 'string' ? JSON.parse(oldType.LBCS) : oldType.LBCS
    newTypesList[oldType.name].NAICS =
      typeof oldType.NAICS == 'string'
        ? JSON.parse(oldType.NAICS)
        : oldType.NAICS
  })

  GEOGRID_object.properties.types = newTypesList

  // inject table props to grid
  GEOGRID_object.properties.header = gridProps
  GEOGRID_object.properties.header.longitude = parseFloat(
    GEOGRID_object.properties.header.longitude,
  )
  GEOGRID_object.properties.header.latitude = parseFloat(
    GEOGRID_object.properties.header.latitude,
  )
  GEOGRID_object.properties.header.rotation = parseFloat(
    GEOGRID_object.properties.header.rotation,
  )
  GEOGRID_object.properties.header.nrows = parseFloat(
    GEOGRID_object.properties.header.nrows,
  )
  GEOGRID_object.properties.header.ncols = parseFloat(
    GEOGRID_object.properties.header.ncols,
  )
  GEOGRID_object.properties.header.cellSize = parseFloat(
    GEOGRID_object.properties.header.cellSize,
  )

  // lastly get the grid features
  GEOGRID_object.features = geoJsonFeatures
  return GEOGRID_object
}

/**
 *
 * @param {typesList} typesList List of types form table editor
 *
 */
const makeGEOGRIDDATAobject = (geoJsonFeatures) => {
  let GEOGRIDDATA_object = []
  geoJsonFeatures.forEach((element) => {
    GEOGRIDDATA_object.push(element.properties)
  })
  return GEOGRIDDATA_object
}

export default function CommitGrid(props) {
  const [reqResonse, setReqResonse] = React.useState(null)

  const reduxState = useSelector((state) => state)
  const hasGrid = reduxState.GRID_CREATED

  const downloadObjectAsJson = () => {
    let GEOGRIDstruct = settings.GEOGRID

    let typesList = reduxState.TYPES_LIST
    let geoJsonFeatures = reduxState.GRID_CREATED.features
    let gridProps = props.gridProps
    let GEOGRID_object = makeGEOGRIDobject(
      GEOGRIDstruct,
      typesList,
      geoJsonFeatures,
      gridProps,
    )
    var dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(GEOGRID_object))
    var downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', dataStr)
    downloadAnchorNode.setAttribute('download', 'grid.json')
    document.body.appendChild(downloadAnchorNode) // required for firefox
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const postGridToCityIO = () => {
    let GEOGRIDstruct = settings.GEOGRID
    let typesList = reduxState.TYPES_LIST
    let geoJsonFeatures = reduxState.GRID_CREATED.features
    let gridProps = props.gridProps
    // take grid struct from settings
    let GEOGRID_object = makeGEOGRIDobject(
      GEOGRIDstruct,
      typesList,
      geoJsonFeatures,
      gridProps,
    )

    let GEOGRIDDATA_object = makeGEOGRIDDATAobject(geoJsonFeatures)
    let tableName = GEOGRID_object.properties.header.tableName.toLowerCase()

    const geoGridOptions = (URL, DATA) => {
      return {
        method: 'post',
        url: URL,
        data: DATA,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    }

    const table_url = `${globalSettings.cityIO.baseURL}${tableName}/`
    const new_table_grid = {
      GEOGRID: GEOGRID_object,
      GEOGRIDDATA: GEOGRIDDATA_object,
    }

    axios(geoGridOptions(table_url, new_table_grid))
      .then(function (response) {
        setReqResonse(reqResonseUI(response, tableName))
      })
      .catch((error) => console.log(`ERROR: ${error}`))
  }

  return (
    <>
      {hasGrid && (
        <>
          <Button
            onClick={() => {
              postGridToCityIO()
            }}
            variant="outlined"
            color="default"
            startIcon={<CloudUploadIcon />}
          >
            Commit Grid to cityIO
          </Button>

          <Button
            onClick={() => {
              // ! download as json
              downloadObjectAsJson()
            }}
            variant="outlined"
            color="default"
            startIcon={<CloudDownloadIcon />}
          >
            Download JSON
          </Button>

          <div style={{ width: '100%' }}> {reqResonse}</div>
        </>
      )}
    </>
  )
}
