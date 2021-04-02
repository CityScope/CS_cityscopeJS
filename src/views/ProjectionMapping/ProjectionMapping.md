# Projection Mapping

This `view` is used to project and display CityScopeJS tables
in passive mode, such as projectors, TVs, or other
non-interactive displays.

## usage

start by selecting your CityScopeJS project. Press
'Spacebar' to toggle keystone. Note: Not all CityScope
projects below are ready for CityScopeJS.

## Communication format

This `view` uses two kinds of comms: 1. websokcets for realtime interfacing with CityScope UI (TUI) 2. cityIO connection (similar to CityScopeJS main app)

## data format for sockets interface

```

 {
        time: 86400, //time of day in seconds
        ABMLayer: {
            active: true, //bool
            ABMmode: "mode", //state
            zoomLevel: 12, //mapbox zoom levels
        },
        AggregatedTripsLayer: {
            active: true,
            ABMmode: "mode",
        },
        GridLayer: {
            active: true,
        },
        AccessLayer: {
            active: true,
            accessToggle: 0,
        },
    };
```

## A simple node server to test sockets function

this server will use the data above, and will update it every 200ms with some random noise.

to run use:
`$ node (or better: nodemon) __FILENAME__.js`

```
const WebSocket = require('ws')
const uiData = {
  time: 86400, //time of day in seconds
  ABMLayer: {
    active: true, //bool
    ABMmode: 'mode', //state
    zoomLevel: 12, //mapbox zoom levels
  },
  AggregatedTripsLayer: {
    active: true,
    ABMmode: 'mode',
  },
  GridLayer: {
    active: true,
  },
  AccessLayer: {
    active: true,
    accessToggle: 0,
  },
}
const server = new WebSocket.Server({ port: 8080 })

server.on('connection', (socket) => {
  socket.send(JSON.stringify(uiData))
  socket.on('message', (message) => {
    console.log(`received from a client: ${message}`)
  })

  setInterval(() => {
    console.log('sending...')
    uiData.time = Math.random() * 86400
    socket.send(JSON.stringify(uiData))
  }, 200)
})
```
