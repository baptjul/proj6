const express = require('express');
const bodyParser = require('body-parser'); // transforme automatiquement la requete en json
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const helmet = require("helmet");

// import du router
const salsaRoutes = require('./routes/object')
// import des login
const userRoutes = require('./routes/user');

require("dotenv").config();

mongoose.connect(process.env.DB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// gestion de l'acces, rend l'api publique
app.use((req, res, next) => {
  // origine, droit d'utilisation, tout le monde
  res.setHeader('Access-Control-Allow-Origin', '*');
  // droit d'utiliser certain headers
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // droit sur les methode d'utilisation
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});



app.use(bodyParser.json());
// Sécurité contre les injections
app.use(helmet());
// gestion de la session utilisateu
app.use(session({
  secret: process.env.SessionKey,
  name: 'sessionId',
  // permet d'éviter des enregistrements de session si aucune modification n'est apporté
  resave: false,
  // permet d'éviter les enregistrements de session sans aucune information
  saveUninitialized: false,
  cookie: {
    // acces au cookie seulement via requette HTTP
    httpOnly: true,
    secure: false,
    //expire après 24h
    maxAge: 86400000,
    // requette doit provenir du même domaine
    sameSite: 'strict'
  }
}))

// url des images définit
app.use('/images', express.static(path.join(__dirname, 'images')))

// definition de l'url de l'api et des routes
app.use('/api/sauces', salsaRoutes)
// pour les login et mdp
app.use('/api/auth', userRoutes)

module.exports = app;