const APP_CONFIG = require('../config');
const sha1 = require('sha1');
const atob = require('atob');
const fs = require('fs');

const userModel = require('../model/user');
const shared = require('../shared/sharedFunctions');

const userController = {
    GET,
    POST,
    PUT,
    DELETE
};

const requestHasAnImage = (request) => {
    return new Promise((resolve, reject) => {
        let image = request.files.image;
        let imageType = image.mimetype.split('/')[1];
        let date = new Date();
        let newImageName = `${date.getMilliseconds()}${date.getSeconds()}${date.getMinutes()}${date.getHours()}${date.getDate()}${date.getMonth()}${date.getFullYear()}.${imageType}`;
        image.mv(`${APP_CONFIG.files.user}${newImageName}`, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(newImageName);
            }
        });
    });
}

function GET(request, response) {

    let id = request.query.id ? request.query.id != 0 ? request.query.id : null : null;
    let position = request.query.position ? Number(request.query.position) : null;

    if (id) {
        userModel.findById(id, (err, document) => {
            if (err) {
                return shared.response(response, 500, shared.message('server.database.error'));
            } else if (document.length === 0) {
                return shared.response(response, 204, shared.message('model.empty'));
            } else {
                document.password = undefined;
                return shared.response(response, 200, document);
            }
        });
    } else if (position >= 0 && position !== null) {
        userModel.find({}, { userName: true, email: true, image: true, role: true })
            .limit(10)
            .skip(position)
            .exec((err, document) => {
                if (err) {
                    return shared.response(response, 500, shared.message('server.database.error'));
                } else if (document.length === 0) {
                    return shared.response(response, 202, shared.message('model.empty'));
                } else {
                    return shared.response(response, 200, document);
                }
            });
    } else {
        return shared.response(response, 400, shared.message('model.user.get.badRequest'));
    }
}

async function POST(request, response) {
    let body = request.body;

    if (!body.hasOwnProperty('userName')) {
        return shared.response(response, 400, shared.message('model.user.post.empty.userName'));
    } else if (!body.userName.length > 0) {
        return shared.response(response, 400, shared.message('model.user.post.empty.userName'));
    } else if (!body.hasOwnProperty('email')) {
        return shared.response(response, 400, shared.message('model.user.post.empty.email'));
    } else if (!body.email.length > 0) {
        return shared.response(response, 400, shared.message('model.user.post.empty.email'));
    } else if (!body.hasOwnProperty('password')) {
        return shared.response(response, 400, shared.message('model.user.post.empty.password'));
    } else if (!body.password.length > 0) {
        return shared.response(response, 400, shared.message('model.user.post.empty.password'));
    } else {
        let userData = {
            userName: body.userName,
            email: body.email,
            password: sha1(atob(body.password))
        };

        if (body.hasOwnProperty('role')) {
            if (body.role.length > 0) {
                userData.role = body.role;
            }
        }

        // Image upload
        if (request.files !== null) {
            if (!request.files.hasOwnProperty('image')) {
                return;
            }

            userData.image = await requestHasAnImage(request).catch((err) => {
                return shared.response(response, 500, shared.message('model.user.post.error.image'));
            });
        }

        let newUser = new userModel(userData);
        newUser.save((err, document) => {
            if (err) {
                // Unique email
                if (err.hasOwnProperty('errors')) {
                    if (err.errors.hasOwnProperty('email')) {
                        return shared.response(response, 400, shared.message('model.user.post.error.email'));
                    }
                } else {
                    return shared.response(response, 500, shared.message('server.database.error'));
                }
            } else {
                document.password = undefined;
                return shared.response(response, 201, document);
            }
        });

    }

}

async function PUT(request, response) {
    let body = request.body;

    if (!body.hasOwnProperty('id')) {
        return shared.response(response, 400, shared.message('model.user.put.empty.id'));
    } if (!body.id.length > 0) {
        return shared.response(response, 400, shared.message('model.user.put.empty.id'));
    } else {
        let userData = {};

        // Validate if user exists
        let userExistsPromise = new Promise((resolve, reject) => {
            userModel.findById(body.id, (err, document) => {
                if (err) {
                    reject(err);
                } else {
                    if (document !== null) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                }
            });
        });
        await userExistsPromise.catch(() => {
            return shared.response(response, 400, shared.message('model.user.all.userWithIdDoesNotExists'))
        })

        if (body.hasOwnProperty('userName')) {
            if (body.userName.length > 0) {
                userData.userName = body.userName;
            }
        }
        if (body.hasOwnProperty('email')) {
            if (body.email.length > 0) {
                userData.email = body.email;
            }
        }
        if (body.hasOwnProperty('password')) {
            if (body.password.length > 0) {
                userData.password = sha1(atob(body.password));
            }
        }
        if (body.hasOwnProperty('role')) {
            if (body.role.length > 0) {
                userData.role = body.role;
            }
        }

        // Image upload
        if (request.files !== undefined) {
            if (!request.files.hasOwnProperty('image')) {
                return;
            }

            // Delete previous image to the user if it is different to the default image
            let dropImage = new Promise((resolve, reject) => {
                userModel.findById(body.id, (err, document) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (document.image !== 'default.png') {
                            fs.unlinkSync(`${APP_CONFIG.files.user}${document.image}`);
                            resolve(true);
                        }
                    }
                });
            });

            await dropImage.catch(() => {
                return shared.response(response, 500, shared.message('server.database.error'));
            });

            userData.image = await requestHasAnImage(request).catch((err) => {
                return shared.response(response, 500, shared.message('model.user.post.error.image'));
            });
        }

        userModel.updateOne({ _id: body.id }, userData, (err, document) => {
            if (err) {
                // Unique email
                if (err.hasOwnProperty('errors')) {
                    if (err.errors.hasOwnProperty('email')) {
                        return shared.response(response, 400, shared.message('model.user.post.error.email'));
                    }
                } else {
                    return shared.response(response, 500, shared.message('server.database.error'));
                }
            } else {
                document.password = undefined;
                return shared.response(response, 200, shared.message('model.user.put.ok'));
            }
        });

    }

}

function DELETE(request, response) {
    let params = request.query;

    if (!params.hasOwnProperty('id')) {
        return shared.response(response, 400, shared.message('model.user.delete.empty.id'));
    } else if (!params.id.length > 0) {
        return shared.response(response, 400, shared.message('model.user.delete.empty.id'));
    } else {
        userModel.findOneAndDelete({ _id: params.id }, (err, document) => {
            if (err) {
                return shared.response(response, 500, shared.message('server.database.error'));
            } else if (document === null) {
                return shared.response(response, 400, shared.message('model.user.delete.error.noUser'));
            } else {
                return shared.response(response, 200, shared.message('model.user.delete.ok'));
            }
        })
    }
}

module.exports = userController;
