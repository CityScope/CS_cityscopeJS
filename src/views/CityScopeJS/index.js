import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import CityIO from './CityIO/cityIO'
import CityIOviewer from '../CityIOviewer'
import LoadingSpinner from './CityIO/LoadingSpinner'
import CSjsMain from './CSjsMain'

export default function CityScopeJS() {
  // get the table name for cityIO comp
  const [tableName, setTableName] = useState(null)
  // on init, get the adress URL
  // to search for  a table
  useEffect(() => {
    let url = window.location.toString()
    let pre = 'cityscope='
    let cityscopePrjName = url.substring(url.indexOf(pre) + pre.length)
    // check URL for proper CS project link
    if (url.indexOf(pre) !== -1 && cityscopePrjName.length > 0) {
      setTableName(cityscopePrjName)
    }
  }, [])

  // wait for 'ready' flag from cityIO when app is ready to start
  const isReady = useSelector((state) => state.READY)
  const cityIOdata = useSelector((state) => state.CITYIO)

  return (
    <>
      {!isReady && (
        <>
          <CityIOviewer />
        </>
      )}

      {tableName && <CityIO tableName={tableName} />}
      {isReady && <CSjsMain cityIOdata={cityIOdata} tableName={tableName} />}

      <LoadingSpinner />
    </>
  )
}
