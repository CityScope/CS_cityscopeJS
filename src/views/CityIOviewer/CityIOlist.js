import { useEffect, useState } from 'react'
import CityIOdeckGLmap from './CityIOdeckGLmap/index'

import axios from 'axios'
import settings from '../../settings/settings.json'

export default function CityIOlist() {
  const [tableList, setTableList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCityIOtables = async () => {
    // ! https://stackoverflow.com/questions/37213783/waiting-for-all-promises-called-in-a-loop-to-finish
    const cityIOlistURL = settings.cityIO.ListOfTables
    // get all URLs
    const tablesArr = await axios.get(cityIOlistURL)
    // create array of all requests
    const requestArr = tablesArr.data.map(async (urlStr) => {
      return axios
        .get(urlStr + '/GEOGRID/properties/header')
        .then((res) =>
          setTableList((oldArray) => [
            ...oldArray,
            { table: urlStr, tableHeader: res.data },
          ]),
        )
        .catch((error) => console.log(error.toString()))
    })

    Promise.all(requestArr).then(() => {
      return
    })
  }

  useEffect(() => {
    fetchCityIOtables().then(setIsLoading(false))
  }, [])

  return <>{!isLoading && <CityIOdeckGLmap cityIOdata={tableList} />}</>
}
