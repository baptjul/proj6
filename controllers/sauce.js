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

// Gestion des likes et des dislikes
exports.likeAndDislike = (req, res, next) => {
  // récupération de l'id de l'utilisateur
  const id = req.body.userId
  switch (req.body.like) {
    // si l'utilisateur avait déjà fais un choix
    case 0:
      Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
          // objet déjà liké
          if (sauce.usersLiked.includes(id)) {
            // retrait de 1 aux likes et retrait de l'id de l'utilisateur du tableau like du produit
            Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: id } })
              .then(() => {
                res.status(201).json({ message: "Like Removed !" });
              })
              .catch(error => res.status(400).json({ error }));
            // objet déjà disliké
          } else if (sauce.usersDisliked.includes(id)) {
            // retrait de 1 aux dislikes et retrait de l'id de l'utilisateur du tableau dislike du produit
            Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: id } })
              .then(() => {
                res.status(201).json({ message: "Dislike Removed !" });
              })
              .catch(error => res.status(400).json({ error }));
          }
        })
      break;
    // si l'utilisateur like
    case 1:
      // si l'utilisateur like l'objet : ajout de 1 aux likes et ajout de l'id aux tableaux like du produit
      Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: +1 }, $push: { usersLiked: id } })
        .then(() => {
          res.status(201).json({ message: "User Like" });
        })
        .catch(error => res.status(400).json({ error }));
      break;
    // si l'utilisateur dislike
    case -1:
      // si l'utilisateur dislike l'objet : ajout de 1 aux dislikes et ajout de l'id aux tableaux dislike du produit
      Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: +1 }, $push: { usersDisliked: id } })
        .then(() => {
          res.status(201).json({ message: "User DisLike !" });
        })
        .catch(error => res.status(400).json({ error }));
      break;
    default:
      throw { error: "failed operation" };
  }
}

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  // existance de req.file en condition
  const sauceObject = req.file ?
    { // si il existe récupération toutes les infos sur l'objet
      ...JSON.parse(req.body.sauce),
      // génération d'une nouvelle image
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      // si il existe pas, copie req.body
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Object modified !' }))
    .catch(error => res.status(400).json({ error }));
};

// Suppression d'une sauce
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

// Récupération d'une seule sauce
exports.getOneSauce = (req, res, next) => {
  // on veut un objet
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

// Récupération de toute les sauces
exports.getAllSauces = (req, res, next) => {
  //on veut la liste complete (promesse)
  Sauce.find()
    // récupère tout les sauces et renvoie réponse
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))
};