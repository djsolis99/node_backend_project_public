const expressFileUpload = require('express-fileupload')
const APP_ROUTER = require('express').Router()
const controller = require('./controller')

APP_ROUTER.get('/user', controller.Security.middleware.MIDDLEWARE_ROLE, controller.User.GET)
APP_ROUTER.post('/user', expressFileUpload(), controller.Security.middleware.MIDDLEWARE_ROLE, controller.User.POST)
APP_ROUTER.put('/user', expressFileUpload(), controller.Security.middleware.MIDDLEWARE_ROLE, controller.User.PUT)
APP_ROUTER.delete('/user', controller.Security.middleware.MIDDLEWARE_ROLE, controller.User.DELETE)

APP_ROUTER.post('/security/auth', controller.Security.AUTH)
APP_ROUTER.post('/security/validate', controller.Security.VALIDATE)

module.exports = APP_ROUTER
