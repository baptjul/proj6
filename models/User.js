// Schema utilisateur

const mongoose = require('mongoose');

// pour s'assurer que l'on est une adresse mail différente par compte
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }
})

// plug in pour mail unique
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema)