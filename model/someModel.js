const mongoose = require('mongoose')
const Schema = mongoose.Schema

const someSchema = new Schema({
    name: String
}, {
    strict: false
})

const someModel = mongoose.model('someModel', someSchema)

module.exports = someModel
