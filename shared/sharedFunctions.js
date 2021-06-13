const messages = require('./../config/messages')
const routesRoles = require('./../config/routesRoles')

function rolesAllowedInRoute(objectAccessRoutes) {
    objectAccessRoutes = objectAccessRoutes.split('/')
    let objectAccessRoutesLength = objectAccessRoutes.length

    // Clean get data
    if (objectAccessRoutes[objectAccessRoutesLength - 1].includes('?')) {
        let newElement = objectAccessRoutes[objectAccessRoutesLength - 1].split('?')[0]
        objectAccessRoutes[objectAccessRoutesLength - 1] = newElement
    }

    var temporalRoles = routesRoles
    for (let i = 0; i < objectAccessRoutesLength; i++) {
        if (temporalRoles[objectAccessRoutes[i]] !== undefined) {
            temporalRoles = temporalRoles[objectAccessRoutes[i]]
        }
    }
    return temporalRoles
}

function message(objectAccessMessage) {
    objectAccessMessage = objectAccessMessage.split('.')
    let objectAccessMessageLength = objectAccessMessage.length

    var temporalMessages = messages
    for (let i = 0; i < objectAccessMessageLength; i++) {
        if (temporalMessages[objectAccessMessage[i]] !== undefined) {
            temporalMessages = temporalMessages[objectAccessMessage[i]]
        }
    }
    return temporalMessages
}

function response(r, s, m) {
    return r.status(s).json({ status: s, message: m })
}

function getMonthName(month) {
    let monthNameList = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    return monthNameList[month - 1]
}

function getMonthNumber(month) {
    let monthNameList = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    return monthNameList.indexOf(month) + 1
}

function dateSalt() {
    let date = new Date()
    return `${date.getDate()}${date.getMonth()}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`
}

module.exports = {
    response,
    message,
    rolesAllowedInRoute,
    getMonthName,
    getMonthNumber,
    dateSalt
}
