import React from 'react'
import { List, ListItem, Divider } from '@material-ui/core'
import Radar from './Radar'
import BarChart from './BarChart'
import AreaCalc from './AreaCalc'

function VisContainer(props) {
  const cityIOdata = props.cityIOdata

  return (
    <>
      {props.cityIOdata && (
        <List>
          <ListItem alignItems="center">
            <AreaCalc cityioData={cityIOdata} />
          </ListItem>

          {cityIOdata.indicators && (
            <>
              <Divider />

              <ListItem>
                <Radar cityioData={cityIOdata} />
              </ListItem>

              <Divider />

              <ListItem>
                <BarChart cityioData={cityIOdata} />
              </ListItem>
            </>
          )}
        </List>
      )}
    </>
  )
}

export default VisContainer
