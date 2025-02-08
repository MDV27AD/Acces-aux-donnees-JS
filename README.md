# Accès aux données JS : Plateforme Centrale - Magasins - Groupe 5

## Description

Plateforme stockant des articles dans une base centrale MySql et distribuant ces articles à 3 magasins distincts en 
fonction des catégories des articles. Chaque magasin a son propre port et url. Lorsqu'un produit est ajouté ou modifié 
dans la base centrale, cela est également fait de manière automatique aux magasins en fonction de la catégorie du produit.

## Technologies utilisées

- MySql
- MongoDB
- Mongoose
- NodeJS
- ExpressJS
- TypeScript
- faker-js

## Installation

Tout d'abord, effectuer l'installation des dépendances à l'aide de l'une des commandes suivantes :
`npm i` ou `yarn install`


## Configuration

### Env

Faire une copie du fichier `.env.example`, ensuite le renommer en `.env` et remplir les variables suivantes :

```toml
GAME_EZ_URL_MONGODB="mongodb://localhost:27017/bd_lc_ad_game_ez?retryWrites=true&w=majority"
SPORT_SALUT_URL_MONGODB="mongodb://localhost:27017/bd_lc_ad_sport_salut?retryWrites=true&w=majority"
MEDIDONC_URL_MONGODB="mongodb://localhost:27017/bd_lc_ad_medidonc?retryWrites=true&w=majority"

GAME_EZ_PORT=3060
SPORT_SALUT_PORT=3061
MEDIDONC_PORT=3062

GAME_EZ_URL="http://localhost:3060/products"
SPORT_SALUT_URL="http://localhost:3061/products"
MEDIDONC_URL="http://localhost:3062/products"

DB_CENTRAL_USER_URI="mysql://<user>:<password>@<host>:<port>/<database>"
DB_ROOT_USER_URI="mysql://<user>:<password>@<host>:<port>/<database>"

BACKEND_PORT=3000
```

## Utilisation

### SQL

Exécuter la commande `npm run sql:start` ou `yarn sql:start` pour lancer la base de données MySql (Cela créera également
les utilisateurs utilisés pour l'appel des différentes procédures MySql). Il vous sera demandé de saisir le mot de passe
de votre utilisateur Root.

### MONGODB

Après activation de la base de données MySQL, lancer également les serveurs MongoDB des différents magasins à 
partir des commandes suivants :

- `npm run serve:game_ez` ou `yarn serve:game_ez`
- `npm run serve:sport_salut` ou `yarn serve:sport_salut`
- `npm run serve:medidonc` ou `yarn serve:medidonc`

⚠️⚠️⚠️ Vérifier que le fichier `.env` est correctement rempli ⚠️⚠️⚠️

### BACKEND

Les différents serveurs étant activés, lancer le serveur backend à partir des commandes suivantes :

- `npm run back:start` ou `yarn back:start`

Exécuter à présent l'initialisation des données via la commande `npm run back:seed` ou `yarn back:seed`

### FRONTEND

Vous pouvez à présent utiliser la commande `npm run front:start` ou `yarn front:start` pour lancer l'interface web.
Si cela n'ouvre pas automatiquement le navigateur, ouvrir le fichier `src/Front/index.html` dans un navigateur.

## Membres du groupe

- Steve Bertrand ETOUNDI MINALA
- Lucien NEUHOFF
- Yusuf ULAS
- Valentin OBERLIN 
