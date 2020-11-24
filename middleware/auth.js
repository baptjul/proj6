// Token de connexion

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // récupération du token dans le header
    const token = req.headers.authorization.split(' ')[1];
    // décode le token avec la fonction verify
    const decodedToken = jwt.verify(token, '2Fu4fB47JVfWY4d3LcUDDmH5ytht2e2kHJAHb7vAvbA3CwJ6mDLHHRUkz9gwEBGTg4WaXeSWcxgtr8aS');
    // extraction de l'id de l'utilisateur
    const userId = decodedToken.userId;
    // si on récupère un id ET qu'il est différent de celui de l'utilisateur
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } // si tout va bien on laisse l'utilisateur continuer
    else {
      next();
    }
  } catch {
    res.status(401).json({ error: error | 'Unauthenticated request !' })
  }
};
