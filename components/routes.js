/**
 * @fileoverview Routes for yerkopi.com
 * @module components/routes
 * @requires express
 * @requires path
 * @requires fs
 * @requires systeminformation
 * @requires dotenv
 * @exports router
 */

const express = require('express')
const path = require('path')
const fs = require('fs')
const si = require('systeminformation')
const dotenv = require('dotenv')

const router = express.Router()
const staticPath = path.join(__dirname, '../public/')

dotenv.config()

/**
 * Pull updates from github
 */
router.post(`/${process.env.WEB_SERVICE_WEBHOOK_LINK}`, (req, res) => {
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

router.post(`/${process.env.TALKSENSE_SERVICE_WEBHOOK_LINK}`, (req, res) => {
    console.log('git pull request received')
    res.send('git pull request received')
    const { exec } = require('child_process');
    exec(`systemctl daemon-reload`, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return
        }
        exec(`systemctl restart yerkopi-talksense.service`, (err, stdout, stderr) => {
            if (err)
                console.error(err);
        })
    })
})

/**
 * Block direct ip access
 */
router.use((req, res, next) => {
    if (req.headers.host.match(/^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/))
        res.status(403).send('forbidden')
    else
        next()
})

/**
 * Get system information
 */
router.get('/yerkopi/ps', (req, res) => {
    si.processes().then(data => {
        data.list = data.list.filter(process => process.cpu > 0 || process.mem > 0)
        res.send(data)
    })
})

router.get('/yerkopi/system', (req, res) => {
    si.system()
    .then(system => {
        si.cpuTemperature()
        .then(cpuTemp => {
            si.cpu()
            .then(cpu => {
                si.mem()
                .then(mem => {
                    si.osInfo()
                    .then(os => {
                        let data = {}
                        data.system = system
                        data.cpu = cpu
                        data.cpuTemp = cpuTemp.main
                        data.mem = mem
                        data.os = os
                        res.send(data)
                    })
                })
            })
        })
    })
})

/**
 * Serve static files
 */
router.get('/assets/huh.png', (req, res) => {
  res.sendFile(path.join(staticPath, 'assets/huh.png'))
})

router.get('/theme', (req, res) => {
  res.sendFile(path.join(staticPath, 'style/theme.css'))
})

router.get('/script', (req, res) => {
  res.sendFile(path.join(staticPath, 'script/main.js'))
})

router.get('/components/footer', (req, res) => {
    res.sendFile(path.join(staticPath, 'components/footer.html'))
})

router.get('/components/header', (req, res) => {
    res.sendFile(path.join(staticPath, 'components/header.html'))
})

router.get('/blog', (req, res) => {
  res.sendFile(path.join(staticPath, 'pages/blog.html'))
})

router.get('/yerkopi', (req, res) => {
  // TO DO: seperate yerkopi service

  res.sendFile(path.join(staticPath, 'pages/yerkopi.html'))
})

router.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'pages/index.html'))
})

module.exports = router