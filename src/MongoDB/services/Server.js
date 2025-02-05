import http from 'http'
import cors from "cors"
import bodyParser from "body-parser"

const corsOptions = {
    origin: [/localhost:8080/],
    optionsSuccessStatus: 200, // For legacy browser support
    credentials: true,
    maxAge: 3600
}

export const appServer = (app, port) => {
    const server = http.createServer(app)
    server.listen(port, () => {
        console.log(`Serveur en cours sur le port ${port}.`)
    })
    app.use(cors(corsOptions))
// parse requests of content-type - application/json
    app.use(bodyParser.json({limit: '50mb'}));
// parse requests of content-type - application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
}