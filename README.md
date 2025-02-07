# Accès aux données JS

Install packages using
`npm i`

### Env

Setup environment variables in `.env` file

```toml
GAME_EZ_URL_MONGODB="mongodb://localhost:27017/bd_lc_ad_game_ez?retryWrites=true&w=majority"
SPORT_SALUT_URL_MONGODB="mongodb://localhost:27017/bd_lc_ad_sport_salut?retryWrites=true&w=majority"
MEDIDONC_URL_MONGODB="mongodb://localhost:27017/bd_lc_ad_medidonc?retryWrites=true&w=majority"

GAME_EZ_PORT=3060
SPORT_SALUT_PORT=3061
MEDIDONC_PORT=3062

GAME_EZ_URL="http://localhost:3060"||"https://acces-aux-donnees-js-mongodb-gameez.onrender.com/products"
SPORT_SALUT_URL="http://localhost:3061"||"https://acces-aux-donnees-js-sport-salut.onrender.com/products"
MEDIDONC_URL="http://localhost:3062"||"https://acces-aux-donnees-js-medidonc.onrender.com/products"

DB_CENTRAL_USER_URI="mysql://<user>:<password>@<host>:<port>/<database>"
DB_ROOT_USER_URI="mysql://<user>:<password>@<host>:<port>/<database>"

BACKEND_PORT=3000
```

## SQL

Begin by create SQL Database

### start

Execute with `npm run sql:start`

## FrontEnd

### start

Execute with `npm run front:start`

## Backend

### start

Build with `npm run back:build`

Start with `npm run back:start`

### seed

Execute with `npm run back:seed`

## MongoDB

### GameEz

Execute with `npm run serve:game_ez`

### Sport Salut

Execute with `npm run serve:sport_salut`

### Medidonc

Execute with `npm run serve:medidonc`
