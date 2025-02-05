import { Router } from "express"
import { createProduct, getAllProducts, getAvailableProducts } from "../controllers/product.controller.js"

const productRouter = Router()

productRouter.post('/', createProduct)
productRouter.get('/', getAllProducts)
productRouter.get('/available', getAvailableProducts)

export default productRouter