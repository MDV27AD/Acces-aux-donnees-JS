import { Router } from "express"
import { createProduct, getAllProducts, getAvailableProducts } from "../controllers/product.controller.js"
import {deleteAllProducts} from "../../GamEZ/controllers/product.controller";

const productRouter = Router()

productRouter.post('/', createProduct)
productRouter.get('/', getAllProducts)
productRouter.get('/available', getAvailableProducts)
productRouter.delete('/', deleteAllProducts)

export default productRouter