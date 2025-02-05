# Accès aux données JS

Install packages using
`npm i`

## SQL

Begin by create SQL Database

### start

Execute with `npm run sql:start`

## FrontEnd

### start

Execute with `npm run front:start`

## BackEnd

### Start

Execute with `npm back:start`

### Seed

Execute with `npm run back:seed`

## MongoDB

### Env

`.env`

```toml
GAME_EZ_URL_MONGODB=mongodb+srv://<user>:<password>@<cluster>/bd_lc_ad_game_ez?retryWrites=true&w=majority
SPORT_SALUT_URL_MONGODB=mongodb+srv://<user>:<password>@<cluster>/bd_lc_ad_sport_salut?retryWrites=true&w=majority
MEDIDONC_URL_MONGODB=mongodb+srv://<user>:<password>@<cluster>/bd_lc_ad_medidonc?retryWrites=true&w=majority

GAME_EZ_PORT=3060
SPORT_SALUT_PORT=3061
MEDIDONC_PORT=3062

DB_CENTRAL_USER_URI="mysql://<user>:<password>@<host>:<port>/<database>"
DB_ROOT_USER_URI="mysql://<user>:<password>@<host>:<port>/<database>"
```

### GameEz

Execute with `npm run serve:game_ez`

### Sport Salut

Execute with `npm run serve:sport_salut`

### Medidonc

Execute with `npm run serve:medidonc`
