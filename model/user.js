const mongoose = require('mongoose')
const mongooseUniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

const userSchema = new Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: false, default: 'default.png' },
    role: { type: String, default: 'USER' }
})
userSchema.plugin(mongooseUniqueValidator)

const userModel = mongoose.model('user', userSchema)

module.exports = userModel
