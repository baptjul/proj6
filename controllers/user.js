// gestion des connexions utilisateurs

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator')

const User = require('../models/User');

// création d'un shcéma de mot de passe
var schema = new passwordValidator();

schema
  // 7 caractères min
  .is().min(7)
  // 20 caractères max
  .is().max(20)
  // Aucun symbols
  .has().not().symbols()
  // Aucun espaces
  .has().not().spaces();

exports.signup = (req, res, next) => {
  if (!schema.validate(req.body.password)) {
    throw { error: "Mot de passe invalide !" }
  } else {
    // hash pour encrypter le mot de passe
    bcrypt.hash(req.body.password, 10)
      // on récupère le hash qu'on va enregistrer
      .then(hash => {
        // on va crée une fiche utilisateur avec le modèle
        const user = new User({
          email: req.body.email,
          password: hash
        })
        // puis on enregistrer la fiche
        user.save()
          .then(() => res.status(201).json({ message: "user created !" }))
          .catch(error => res.status(400).json({ error }))

      })
      .catch(error => res.status(500).json({ error }))
  }
};

exports.login = (req, res, next) => {
  // on va chercher l'utilisateur dans la base de donné avec l'adresse mail
  User.findOne({ email: req.body.email })
    .then(user => {
      // si l'utilsateur n'existe pas
      if (!user) {
        return res.status(401).json({ error: 'User not found !' });
      }
      // comparation du hash envoyé et celui stocké
      bcrypt.compare(req.body.password, user.password)
        // recois un booleen
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Incorrect password !' });
          }
          // on renvoie un objet
          res.status(200).json({
            userId: user._id,
            // fonction de jsonwebtoken
            token: jwt.sign(
              // les données a encodé : le payload
              { userId: user._id },
              //clé pour encodage
              '2Fu4fB47JVfWY4d3LcUDDmH5ytht2e2kHJAHb7vAvbA3CwJ6mDLHHRUkz9gwEBGTg4WaXeSWcxgtr8aS',
              // temps jusqu'a expiration du token 
              { expiresIn: '48h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    // en cas de problème de connection
    .catch(error => res.status(500).json({ error }));

};