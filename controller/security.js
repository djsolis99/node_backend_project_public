const APP_CONFIG = require('../config');
const jwt = require('jsonwebtoken');
const sha1 = require('sha1');
const atob = require('atob');

const userModel = require('../model/user');
const shared = require('../shared/sharedFunctions');

const securityController = {
    AUTH,
    VALIDATE,
    middleware: {
        MIDDLEWARE_ROLE
    }
};

function findUserByEmailAndPassword(userName, password) {
    return new Promise((resolve, reject) => {
        userModel.findOne({ email: userName, password: password }, (err, document) => {
            if (err) {
                reject(err);
            } else {
                resolve(document);
            }
        });
    });
}

function findUseByUserNameAndPassword(userName, password) {
    return new Promise((resolve, reject) => {
        userModel.findOne({ userName: userName, password: password }, (err, document) => {
            if (err) {
                reject(err);
            } else {
                resolve(document);
            }
        });
    });
}

function getUserDataFromToken(token) {
    return new Promise((resolve, reject) => {
        try {
            var decoded = jwt.verify(token, APP_CONFIG.keys.secret);
        } catch (err) {
            reject('badToken');
        }

        userModel.findOne({ email: decoded.email }, (err, document) => {
            if (err) {
                reject(err);
            } else {
                resolve(document);
            }
        });
    });
}

function AUTH(request, response) {
    let body = request.body;

    if (!body.hasOwnProperty('userName')) {
        return shared.response(response, 400, shared.message('model.security.auth.empty.userName'));
    } else if (!body.userName.length > 0) {
        return shared.response(response, 400, shared.message('model.security.auth.empty.userName'));
    } else if (!body.hasOwnProperty('password')) {
        return shared.response(response, 400, shared.message('model.security.auth.empty.password'));
    } else if (!body.password.length > 0) {
        return shared.response(response, 400, shared.message('model.security.auth.empty.password'));
    } else {
        let userName = body.userName;
        let password = sha1(atob(body.password));

        // find user
        Promise.all([findUserByEmailAndPassword(userName, password), findUseByUserNameAndPassword(userName, password)])
            .then((documents) => {
                if (documents[0] === null && documents[1] === null) {
                    return shared.response(response, 400, shared.message('model.security.auth.error.noUser'));
                }
                // find the good document
                var document;
                for (let i = 0; i < documents.length; i++) {
                    if (documents[i] !== null) {
                        document = documents[i];
                    }
                }
                document.password = undefined;

                // generate token
                jwt.sign({
                    userName: document.userName,
                    email: document.email
                }, APP_CONFIG.keys.secret, { expiresIn: '6h' }, (err, token) => {
                    return shared.response(response, 200, token);
                });
            }).catch((err) => {
                console.log(err);
                return shared.response(response, 500, shared.message('server.database.error'));
            });
    }
}

function VALIDATE(request, response) {
    let body = request.body;

    if (!body.hasOwnProperty('token')) {
        return shared.response(response, 400, shared.message('model.security.validate.empty.token'));
    }
    if (!body.token.length > 0) {
        return shared.response(response, 400, shared.message('model.security.validate.empty.token'));
    }

    getUserDataFromToken(body.token).then((document) => {
        if (document === null) {
            return shared.response(response, 400, shared.message('model.auth.validate.error.invalidToken'));
        } else {
            document.password = undefined;
            return shared.response(response, 200, document);
        }
    }).catch((err) => {
        if (err === 'badToken') {
            return shared.response(response, 400, shared.message('model.security.validate.error.invalidToken'));
        } else {
            return shared.response(response, 500, shared.message('server.database.error'));
        }
    });

}

async function MIDDLEWARE_ROLE(request, response, next) {

    // Get roles allowed for this url
    let rolesAllowed = shared.rolesAllowedInRoute(request.url);

    // If all users are allowed jump this process
    if (rolesAllowed.includes('ALL')) {
        next();
    } else {
        // get token from the headers
        let token = request.headers.token || null;

        if (!token) {
            return shared.response(response, 401, shared.message('server.session.noToken'));
        }

        // get user info
        getUserDataFromToken(token).then((document) => {
            if (document === null) {
                return shared.response(response, 401, shared.message('server.session.invalidToken'));
            }

            // Validate if the user are allowed here
            if (rolesAllowed.includes(document.role)) {
                next();
            } else {
                return shared.response(response, 401, shared.message('server.session.notAllowed'));
            }
        }).catch((err) => {
            if (err === 'badToken') {
                return shared.response(response, 400, shared.message('server.session.invalidToken'));
            } else {
                return shared.response(response, 500, shared.message('server.database.error'));
            }
        });
    }
}

module.exports = securityController;
