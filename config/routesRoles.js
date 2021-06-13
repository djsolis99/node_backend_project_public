module.exports = {
    someEndpoint: ['ALL'],
    security: {
        validate: [
            'ADMIN'
        ]
    },
    user: ['ADMIN'],
    files: {
        get: [
            'ADMIN',
            'USER'
        ],
        download: [
            'ADMIN',
            'USER'
        ]
    },
}
