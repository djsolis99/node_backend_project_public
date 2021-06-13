const APP_CONFIG = require('./config')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const APP_ROUTER = require('./routes')
const app = express()

// Middleware plugin
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
// Routes
app.use(APP_ROUTER)
app.use('/files', express.static('files'))

// Database initialization
mongoose.connect(`mongodb://${APP_CONFIG.database.host}:${APP_CONFIG.database.port}/${APP_CONFIG.database.database}`, { auth: { user: APP_CONFIG.database.username, password: APP_CONFIG.database.password }, useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
        console.error('[!] Error connecting to the database', err)
        return
    } else {
        console.log('[+] Database up')

        // Server initializacion
        app.listen(APP_CONFIG.server.port, (err) => {
            if (err) {
                console.error('[!] Error uploading the server', err)
                return
            } else {
                console.log('[+] Server up')
            }
        })
    }
})
