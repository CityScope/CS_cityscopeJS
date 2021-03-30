import { useEffect } from 'react'

import { useDispatch } from 'react-redux'
import { setUIWebsocketData, setUIWebsocketReady } from '../../../redux/actions'
import settings from '../../../settings/settings.json'

/*
https://stackoverflow.com/questions/39728000/react-native-with-websocket-doesnt-work
*/

const UIWebsocket = () => {
  var socket = new WebSocket(settings.SOCKETS.URL)

  const dispatch = useDispatch()

  useEffect(() => {
    socket.onopen = () => {
      socket.send('CityScopeJS')

      socket.onmessage = ({ data }) => {
        dispatch(setUIWebsocketReady(true))
        dispatch(setUIWebsocketData(JSON.parse(data)))
      }
    }
  }, [])
  return null
}

export default UIWebsocket
