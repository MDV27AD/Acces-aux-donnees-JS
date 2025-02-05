import dotenv from 'dotenv'
// Routes
import sportSalutProductRoute from "./routes/product.route.js"
// Services
import { MongoDb, MongoApp, AppServer } from "../services/index.js"
import express from "express";

dotenv.config()

const app = express()

AppServer(app, process.env.SPORT_SALUT_PORT)

// simple route
app.get("/", (_req, res) => {
    res.json({ message: "✅ Bienvenue dans mon serveur SPORT_SALUT" })
})
// MongoDb
MongoApp(app, 'SPORT_SALUT', sportSalutProductRoute)
MongoDb(process.env.SPORT_SALUT_URL_MONGODB).then()
console.log(`process.env.SPORT_SALUT_URL_MONGODB`, process.env.SPORT_SALUT_URL_MONGODB)