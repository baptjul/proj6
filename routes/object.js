// création d'un routeur
const express = require('express');
const router = express.Router();

// avec auth l'utilisateur doit être authentifier pour acceder au donnés et les modifier
const auth = require('../middleware/auth');
// multer pour l'importation d'image
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/object')

// Get de toutes les donnes sur le serveur
router.get('/', auth, sauceCtrl.getAllSauces);
// requete POST
router.post('/', auth, multer, sauceCtrl.createSauce);
// requete POST likes
router.post('/:id/like', auth, sauceCtrl.likeAndDislike);
// segment dynamique pour un seul objet grace a son id
router.get('/:id', auth, sauceCtrl.getOneSauce);
// pour mettre a jour un objet existant
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
// pour supprimer un objet existant
router.delete('/:id', auth, sauceCtrl.deleteSauce);


module.exports = router;
