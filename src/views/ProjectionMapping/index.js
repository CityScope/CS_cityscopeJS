import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import CityIO from './CityIO/'
import Keystone from './Keystone'
import { Container, Typography, makeStyles, Box } from '@material-ui/core'
import TableNameInput from '../../Components/TableNameInput'
import Page from '../../layouts/Page'
import UIWebsocket from './UIWebsocket'

export default function CityScopeJS() {
  // wait for 'ready' flag from cityIO when app is ready to start
  const isCityIOready = useSelector((state) => state.READY)
  const isSocketUIready = useSelector((state) => state.UI_WEBSOCKET_READY)

  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: 'auto',
        height: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3),
      },
    },
  }))

  const [selectedTable, setSelectedTable] = useState(null)

  const ListOfTables = () => {
    return (
      <Container maxWidth="md">
        <Typography color="textPrimary" variant="h1">
          Projection tool
        </Typography>
        <Box mt={'3em'} />
        <Typography color="textPrimary">
          This tool is used to project and display CityScopeJS tables in passive
          mode, such as projectors, TVs, or other non-interactive displays.
        </Typography>
        <Box mt={'2em'} />
        <Typography color="textPrimary" variant="caption">
          start by selecting your CityScopeJS project. Press 'Spacebar' to
          toggle keystone. Note: Not all CityScope projects below are ready for
          CityScopeJS.
        </Typography>
        <Box mt={'2em'} />
        <TableNameInput setSelectedTable={setSelectedTable} />
      </Container>
    )
  }

  const classes = useStyles()
  return (
    <>
      <UIWebsocket />
      <Page className={classes.root} title="Keystone">
        {!isCityIOready && <ListOfTables />}
        {selectedTable && <CityIO tableName={selectedTable} />}

        {isCityIOready && isSocketUIready && <Keystone />}
      </Page>
    </>
  )
}
