import { Router } from "express"
import { createProduct, getAllProducts, getAvailableProducts, deleteAllProducts } from "../controllers/product.controller.js"

const productRouter = Router()

productRouter.post('/', createProduct)
productRouter.get('/', getAllProducts)
productRouter.get('/available', getAvailableProducts)
productRouter.delete('/', deleteAllProducts)

export default productRouter