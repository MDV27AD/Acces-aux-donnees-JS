import { Router } from "express"
import { createProduct, getAllProducts, getAvailableProducts, deleteAllProducts, getOneProduct
    , deleteProductBySerialNumber } from "../controllers/product.controller.js"

const productRouter = Router()

productRouter.post('/', createProduct)
productRouter.get('/', getAllProducts)
productRouter.get('/:identifier', getOneProduct)
productRouter.get('/available', getAvailableProducts)
productRouter.delete('/', deleteAllProducts)
productRouter.delete('/:serialNumber', deleteProductBySerialNumber)

export default productRouter