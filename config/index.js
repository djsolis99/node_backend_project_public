const APP_CONFIG = {
    server: {
        port: 8081
    },
    database: {
        host: '',
        port: 27017,
        database: '',
        username: '',
        password: ''
    },
    files: {
        user: 'files/user/',
        somefolder: {
            path: 'files/somefolder/',
            templateName: 'sometemplate@salt.csv'
        }
    },
    keys: {
        secret: 'superSecretKey123456?'
    },
    roles: [
        'ADMIN',
        'USER'
    ]
}

module.exports = APP_CONFIG
