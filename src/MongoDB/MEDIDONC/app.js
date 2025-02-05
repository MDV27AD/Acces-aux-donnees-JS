import express from "express"
import dotenv from 'dotenv'
// Routes
import meDiDoncProductRoute from "./routes/product.route.js"
// Services
import {MongoDb, MongoApp, AppServer} from "../services/index.js"

dotenv.config()

const app = express()

AppServer(app, process.env.MEDIDONC_PORT)

// simple route
app.get("/", (_req, res) => {
    res.json({ message: "✅ Bienvenue dans mon serveur GameEz" })
})
// MongoDb
MongoApp(app, 'MEDIDONC', meDiDoncProductRoute)
MongoDb(process.env.MEDIDONC_URL_MONGODB).then()
console.log(`process.env.MEDIDONC_URL_MONGODB`, process.env.MEDIDONC_URL_MONGODB)