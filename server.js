/**
 * YERKOPI WEB SERVICE
 * 
 */

const routes = require('./components/routes')

const express = require('express')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const port = process.env.SERVER_PORT

app.use('/', routes)

/**
 * Start the server
 */
function startServer() {
  console.log('starting the server...')

  app.listen(port, () => {
    console.log(`server listening on port ${port}`)
  })
}

startServer()
