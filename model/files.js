const mongoose = require('mongoose')
const Schema = mongoose.Schema

const filesSchema = new Schema({
    type: String,
    name: String,
    path: String,
    creationDate: Date
}, {
    strict: false
})

const filesModel = mongoose.model('files', filesSchema, 'files')

module.exports = filesModel
