#!/usr/bin/env node
import app from './app'

const normalizePort = (port: number) => {
  if (port >= 0) {
    // port number
    return port
  }

  return false
}

const onError = (error: { syscall: string; code: string }) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}

const onListening = () => {
  let addr = server.address()
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  console.info('[starting] Listening on ' + bind)
}

const port = normalizePort(parseInt(process.env.PORT || '2013'))
app.set('port', port)

const server = require('http').createServer(app)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
