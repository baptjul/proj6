// création d'un shcéma de mot de passe
const passwordValidator = require('password-validator')

const PasswordScheme = new passwordValidator();

PasswordScheme
    // 7 caractères min
    .is().min(7)
    // 20 caractères max
    .is().max(20)
    // Aucun symbols
    .has().not().symbols()
    // Aucun espaces
    .has().not().spaces();

// exportation du modèle
module.exports = PasswordScheme;