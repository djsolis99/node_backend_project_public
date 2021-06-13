module.exports = {
    server: {
        database: {
            error: 'There was a trouble related to the database'
        },
        session: {
            noToken: 'You may pass the token in the headers',
            invalidToken: 'Token invalid',
            notAllowed: 'User not allowed'
        }
    },
    model: {
        emptyBody: 'Send something in the body',
        empty: 'There are any data to return',
        security: {
            auth: {
                empty: {
                    userName: 'Send the userName as a body value',
                    password: 'Send the password as a body value and coded in base64'
                },
                error: {
                    noUser: 'The user that you want to auth does not exist'
                }
            },
            validate: {
                empty: {
                    token: 'Send the token as a body value'
                },
                error: {
                    invalidToken: 'Token invalid'
                }
            }
        },
        user: {
            all: {
                userWithIdDoesNotExists: 'The user with this id does not exists'
            },
            get: {
                badRequest: 'Send the parameters /user/[id|0]/[position|empty]'
            },
            post: {
                empty: {
                    userName: 'Send the userName as a body value',
                    email: 'Send the email as a body value',
                    password: 'Send the password as a body value and coded in base64'
                },
                error: {
                    email: 'Please choose another email',
                    image: 'There was a trouble trying to upload the image'
                }
            },
            put: {
                ok: 'User updated correctly',
                empty: {
                    id: 'Send the id as a body value'
                }
            },
            delete: {
                ok: 'User deleted correctly',
                empty: {
                    id: 'Send the parameter "/user/id"'
                },
                error: {
                    noUser: 'The user that you want to delete does not exist'
                }
            }
        },
        files: {
            download: {
                empty: {
                    id: 'Send the id as a body value'
                },
                error: {
                    noFile: 'File does not exists',
                    internal: 'There was an internal error'
                }
            }
        }
    }
};
