import dotenv from 'dotenv'
// Routes
import gameEzProductRoute from "./routes/product.route.js"
// Services
import {MongoDb, MongoApp, appServer} from "../services/index.js"
import express from "express";

dotenv.config()

const app = express()

appServer(app, process.env.GAME_EZ_PORT)

// simple route
app.get("/", (_req, res) => {
    res.json({ message: "✅ Bienvenue dans mon serveur GameEz" })
})
// MongoDb
MongoApp(app, 'GameEz', gameEzProductRoute)
MongoDb(process.env.GAME_EZ_URL_MONGODB).then()
console.log(`process.env.GAME_EZ_URL_MONGODB`, process.env.GAME_EZ_URL_MONGODB)