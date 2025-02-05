import errorHandler from '../middlewares/errorHandler.js'
import { json, urlencoded } from 'express'

export function MongoApp (app, service, route) {
    app.use(json())
    app.use(urlencoded({ extended: true }))
    app.use(`/${service}/products`, route)

    app.use(errorHandler)
    return app
}