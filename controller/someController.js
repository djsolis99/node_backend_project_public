const someModel = require('../model/someModel.js');

const someController = {
    GET
};

function GET(request, response) {
    return response.status(200).json({
        status: 200,
        message: 'Some example'
    });
}

module.exports = someController;
