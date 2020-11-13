// Schema utilisateur

const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, //unique pour que une adresse mail ne soit utiliser qu'une seule fois
    password: { type: String, required: true }
})

// plug in pour mail unique
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema)