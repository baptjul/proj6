# SoPekocko backend server #

### Prérequis ###

Pour démarrer le serveur vous aurez besoin d'avoir `express` installé. 

Vous aurez aussi besoin de renommer le fichier `env_.txt` en `.env` et de remplacer les valeurs des variables qu'il contient :
	- `DB_CONNECTION` contiendra l'adresse du serveur
	- `SessionKey` contiendra la clé signature des cookies
	- `TOKEN` contiendra la clé signature des tokens

Si vous décidez d'utiliser ce serveur sur un port différent que le port par défaut (3000) vous pouvez ajouter dans `.env` la variable `PORT` ainsi que la valeur désirée.

### Lancement ###

Une fois le fichier `.env` configuré, démarrez le serveur avec `nodemon server`
