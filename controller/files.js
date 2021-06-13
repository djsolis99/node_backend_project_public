const model = require('../model/')
const shared = require('../shared/sharedFunctions')

const filesController = {
    GET,
    DOWNLOAD
}

// Filters: tipo: sondeodeprecios|
function GET(request, response) {
    let params = request.query
    let filter = {}
    if (params.hasOwnProperty('tipo')) {
        filter.type = params.tipo
    }

    model.Files.find(filter, (err, documents) => {
        if (err) {
            return shared.response(response, 500, err)
        } else {
            return shared.response(response, 200, documents)
        }
    })

}

function DOWNLOAD(request, response) {
    let params = request.query
    let filter = {}
    if (!params.hasOwnProperty('id')) {
        return shared.response(response, 400, shared.message('model.files.download.empty.id'))
    }
    filter._id = params.id

    model.Files.find(filter, (err, documents) => {
        if (err) {
            return shared.response(response, 500, shared.message('model.files.download.error.internal'))
        } else {
            if (documents.length === 0) {
                return shared.response(response, 200, shared.message('model.files.download.error.noFile'))
            } else {
                return response.status(200).download(documents[0].path)
            }
        }
    })
}

module.exports = filesController
