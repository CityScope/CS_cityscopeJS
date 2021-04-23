import { useEffect, useState } from 'react'
import axios from 'axios'
import settings from '../settings/settings.json'
import { Button } from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}))
export default function TableNameInput({ setSelectedTable }) {
  const classes = useStyles()
  const [tableList, setTableList] = useState()

  useEffect(() => {
    /**
     * Gets all tables on init
     */
    let buttonsArr = []
    const cityIOlistURL = settings.cityIO.ListOfTables
    const cityIOtableBaseUrl = settings.cityIO.baseURL

    axios.get(cityIOlistURL).then((res) => {
      res.data.forEach((tableName) => {
        const geogridUrl = `${cityIOtableBaseUrl}${tableName}/GEOGRID/`
        buttonsArr.push(
          <Button
            key={Math.random()}
            variant="outlined"
            color="secondary"
            onClick={() => {
              axios
                .get(geogridUrl)
                .then((res) => {
                  if (res.status === 200) {
                    setSelectedTable(tableName)
                  }
                })
                .catch((err) => {
                  console.log(err)
                })
            }}
          >
            {tableName}
          </Button>,
        )
      })
      setTableList(buttonsArr)
    })
  }, [setSelectedTable])

  return <div className={classes.root}>{tableList}</div>
}
