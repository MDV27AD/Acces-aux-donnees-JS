import { Product } from '../models/product.model.js'

export const createProduct = async (req, res) => {
    const { serialNumber: product_serial_number, sku: product_sku, name: product_name, description: product_description
        , seller : { name: seller_name, createdAt: seller_creation_date}, price } = req.body
    const category = req.body['category']?.toLowerCase()
    // Verify if category is valid
    if (['jeu vidéo','jeu de société'].includes(category)){
        // Create new product
        const product = await Product.create({
            product : {product_sku, product_serial_number, product_name, product_description
                , product_price: price + (price * (category === 'jeu vidéo' && 10 || 15) / 100)},
            seller : {seller_name, seller_creation_date}
        })
        // Return the newly created product
        return res.status(201).json(product)
    }
    return res.status(400).json({ message: 'Invalid category' })
}

export const getAllProducts = async (_req, res) => {
    const menus = await Product.find()
    res.status(200).json(menus)
}

export const getAvailableProducts = async (_req, res) => {
    const menus = await Product.find({ product_status: 'available' })
    res.status(200).json(menus)
}