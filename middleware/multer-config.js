// pour la gestion des images

// import de multer
const multer = require('multer');

// dictionnaire
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
  'image/png': 'png'
};

// va être enregistrer sur le disque
const storage = multer.diskStorage({
  // dans quel dossier l'enregistrer
  destination: (req, file, callback) => {
    // le callback avec le nom de dossier
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    // on génère un nouveau nom pour éviter les nom identiques
    const name = file.originalname.split(' ').join('_');
    // ajoute l'extension du fichier selon le type d'image
    const extension = MIME_TYPES[file.mimetype];
    // création du nom en entier + time stamp + . + extension du fichier
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({ storage: storage }).single('image');
