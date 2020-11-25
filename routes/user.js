const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const rateLimit = require('express-rate-limit');

// Définition d'un limite de connexion ou de compte crée
const connexionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 8, // limite chaque IP à 8 requêtes
    message: "too many tries: try again later !"
})


router.post('/signup', userCtrl.signup);
router.post('/login', connexionLimiter, userCtrl.login);

module.exports = router