const express = require('express');
const bodyParser = require('body-parser'); // transforme automatiquement la requete en json
const mongoose = require('mongoose');
const path = require('path');

// import du router
const salsaRoutes = require('./routes/object')
// import des login
const userRoutes = require('./routes/user')

// connexion au serveur mongoose
mongoose.connect('mongodb+srv://admin:zYCFn81f85XWAgXD@sopekocko.uoauq.mongodb.net/Piquante?retryWrites=true&w=majority',
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

app.use('/images', express.static(path.join(__dirname, 'images')))

// definition de l'url de l'api et des routes
app.use('/api/sauces', salsaRoutes)
// pour les login et mdp
app.use('/api/auth', userRoutes)

module.exports = app;