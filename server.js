/**
 * YERKOPI WEB SERVICE
 * 
 */

const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const si = require('systeminformation')
const uuid = require('uuid')
const fs = require('fs')

const app = express()
const port = dotenv.config().parsed.SERVER_PORT
const staticPath = path.join(__dirname, './public/')

let key = {}

/**
 * Pull updates from github
 */
console.log(`Webhook route: POST /${dotenv.config().parsed.GITHUB_WEBHOOK_LINK}`)

app.post(`/${dotenv.config().parsed.GITHUB_WEBHOOK_LINK}`, (req, res) => {
    console.log('git pull request received')
    res.send('git pull request received')
    const { exec } = require('child_process');
    exec(`systemctl daemon-reload`, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return
        }
        process.exit(1)
    })
})

/**
 * Block direct ip access
 */
app.use((req, res, next) => {
    if (req.headers.host.match(/^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/))
        res.status(403).send('forbidden')
    else
        next()
})

/**
 * Key middleware
 */
const keyMiddleware = (req, res, next) => {
    if (req.query.k === key.uuid) {
        if (Date.now() - key.time > dotenv.config().parsed.KEY_TIMEOUT_MS)
            key = {}
        next()
    } else {
        res.status(401).send('unauthorized')
    }
}

/**
 * Get system information
 */
app.get('/yerkopi/ps', keyMiddleware, (req, res) => {
    si.processes().then(data => {
        data.list = data.list.filter(process => process.state === 'running')
        res.send(data)
    })
})

app.get('/yerkopi/system', keyMiddleware, (req, res) => {
    si.system()
    .then(system => {
        si.cpuTemperature()
        .then(cpuTemp => {
            si.cpu()
            .then(cpu => {
                si.mem()
                .then(mem => {
                    let data = {}
                    data.system = system
                    data.cpu = cpu
                    data.cpuTemp = cpuTemp.main
                    data.mem = mem
                    res.send(data)
                })
            })
        })
    })
})

/**
 * Serve static files
 */
app.get('/assets/huh.png', (req, res) => {
  res.sendFile(path.join(staticPath, 'assets/huh.png'))
})

app.get('/theme', (req, res) => {
  res.sendFile(path.join(staticPath, 'style/theme.css'))
})

app.get('/script', (req, res) => {
  res.sendFile(path.join(staticPath, 'script/main.js'))
})

app.get('/components/footer', (req, res) => {
    res.sendFile(path.join(staticPath, 'components/footer.html'))
})

app.get('/components/header', (req, res) => {
    res.sendFile(path.join(staticPath, 'components/header.html'))
})

app.get('/blog', (req, res) => {
  res.sendFile(path.join(staticPath, 'pages/blog.html'))
})

app.get('/yerkopi', (req, res) => {
  // TO DO: seperate yerkopi service
  key.uuid = uuid.v4()
  key.time = Date.now()

  let index = fs.readFileSync(path.join(staticPath, 'pages/yerkopi.html'), 'utf8')
  index = index.replace('{{ THE KEY }}', key.uuid)
  res.send(index)
})

app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'pages/index.html'))
})

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
