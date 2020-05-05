require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const cors = require('cors')

const logger = require('./helpers/logger')

let appPort = process.env.APP_PORT || 8000
let appHost = process.env.APP_HOST || '0.0.0.0'
let appName = process.env.APP_NAME || 'MCPanel.js'

let app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(compression())
app.use(cors())

app.get('/', (req, res) => {
    return res.sendStatus(200)
})

app.use('/users', require('./routes/users'))
app.use('/servers', require('./routes/servers'))
app.use('/actions', require('./routes/actions'))

app.use((req, res) => {
    let err = new Error('Not Found')
    err.status = 404
    logger.error(err.message)
    return res.sendStatus(err.status)
})

app.listen(appPort, appHost, () => (logger.info(`${appName} is now started at ${appHost}:${appPort}`)))
