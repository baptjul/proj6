// requetes gestion des éléments de l'API

// import du modèle d'objet
const Sauce = require('../models/Sauce')
// permet l'acces au system de fichier
const fs = require('fs');

// Création d'une sauce
exports.createSauce = (req, res, next) => {
  // extraction du corps
  const sauceObject = JSON.parse(req.body.sauce);
  // suppression de l'id
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    // protocole : http ou https :// la racine du serveur /image/ le nom du fichier
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Object saved !' }))
    .catch(error => res.status(400).json({ error: error }));
};

// Gestion des likes

exports.modifySauce = (req, res, next) => {
  // existance de req.file en condition
  const sauceObject = req.file ?
    { // si il existe récupération toutes les infos sur l'objet
      ...JSON.parse(req.body.sauce),
      // génération d'une nouvelle image
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      // si il existe pas de copie req.body
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Object modified !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  // trouver l'element qui a l'id qui correspond
  Sauce.findOne({ _id: req.params.id })
    // on va recupere le nom exact du fichier
    .then(sauce => {
      // split va récupérer ce qu'il a avant et après /images/ et ce qu'il y a après contient le nom
      const filename = sauce.imageUrl.split('/images/')[1];
      // filesystem.unlink va supprimer l'image (nome de l'image et le callback)
      fs.unlink(`images/${filename}`, () => {
        // suppression de l'objet dans la base de donnés
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Object deleted !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  // on veut un objet
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  //on veut la liste complete (promesse)
  Sauce.find()
    // récupère tout les sauces et renvoie réponse
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))
};

