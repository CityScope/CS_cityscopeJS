import MaterialTable from '@material-table/core'
import React, { useState, useEffect } from 'react'
import { Grid, Typography } from '@material-ui/core'

import {
  listenToRowEdits,
  listeonToTypesList,
  listenToGridCreator,
} from '../../../../redux/actions'
import { useDispatch } from 'react-redux'
import settings from '../../../../settings/GridEditorSettings.json'

export default function TypesEditor() {
  const createtypesArray = (LanduseTypesList) => {
    let typesArray = []
    Object.keys(LanduseTypesList).forEach((type) => {
      typesArray.push({
        name: type,
        description: 'description for: ' + type,
        color: LanduseTypesList[type].color,
        height: LanduseTypesList[type].height
          ? LanduseTypesList[type].height
          : 0,

        LBCS: LanduseTypesList[type].LBCS
          ? JSON.stringify(LanduseTypesList[type].LBCS)
          : null,
        NAICS: LanduseTypesList[type].NAICS
          ? JSON.stringify(LanduseTypesList[type].NAICS)
          : null,
        interactive: LanduseTypesList[type].interactive,
      })
    })
    return typesArray
  }

  const [state, setState] = React.useState({
    columns: [
      {
        title: 'Type',
        field: 'name',
      },
      {
        title: 'Description',
        field: 'description',
      },

      {
        title: 'Height',
        field: 'height',
        type: 'numeric',
      },
      {
        title: 'Interactive',
        field: 'interactive',
        lookup: { No: 'No', Web: 'Web', TUI: 'TUI' },
      },
      {
        title: 'Color',
        field: 'color',
        type: 'string',
      },
      {
        title: 'LBCS',
        field: 'LBCS',
        type: 'string',
      },
      {
        title: 'NAICS',
        field: 'NAICS',
        type: 'string',
      },
    ],
    data: createtypesArray(settings.GEOGRID.properties.types),
  })

  const dispatch = useDispatch()
  const [selectedRow, setSelectedRow] = useState(null)
  const [rowColor, setRowColor] = useState(null)

  // redux the type list on every change
  useEffect(() => {
    dispatch(listeonToTypesList(state.data))
  })

  return (
    <Grid container>
      <Grid item xs={12} s={12} m={12} l={12} xl={12}>
        <MaterialTable
          title={<Typography variant="h2">Types Editor</Typography>}
          columns={state.columns}
          data={state.data}
          options={{
            paging: false,
            search: true,
            selection: false,
            rowStyle: (rowData) => ({
              fontFamily: 'Roboto Mono',
              fontSize: 12,
              backgroundColor:
                selectedRow === rowData.tableData.id ? rowColor : null,
            }),
          }}
          onRowClick={(evt, row) => {
            setSelectedRow(row.tableData.id)
            setRowColor(row.color)
            dispatch(listenToRowEdits(row))
          }}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve()
                  setState((prevState) => {
                    const data = [...prevState.data]
                    data.push(newData)
                    return { ...prevState, data }
                  })
                }, 200)
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve()
                  if (oldData) {
                    setState((prevState) => {
                      const data = [...prevState.data]
                      data[data.indexOf(oldData)] = newData

                      return { ...prevState, data }
                    })
                  }

                  // dispath change to redux
                  dispatch(listenToRowEdits(newData))
                }, 200)
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve) => {
                console.log(oldData)

                setTimeout(() => {
                  resolve()
                  setState((prevState) => {
                    const data = [...prevState.data]
                    data.splice(data.indexOf(oldData), 1)
                    return { ...prevState, data }
                  })

                  dispatch(listenToGridCreator(null))
                }, 200)
              }),
          }}
        />
      </Grid>
    </Grid>
  )
}
