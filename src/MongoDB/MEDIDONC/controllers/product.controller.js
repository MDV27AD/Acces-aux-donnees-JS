import { Product } from '../models/product.model.js'

export const createProduct = async (req, res) => {
    const { sku: p_sku, name: p_name, description: p_description, updatedAt: p_last_update, supplierId: id
        , supplierName: name, supplierCreatedAt: creation_date, price: p_price, serialNumber: p_serial_number, category } = req.body
    // Verify if category is valid
    if (['santé','sport sain'].includes(category?.toLowerCase())){
        // Verify if product exists
        const productFound = await Product.findOne({p_serial_number})
        if (productFound)
            return res.status(400).json({ message: `A product with serial number ${p_serial_number} exists.`, product: productFound})
        // Create new product
        const product = await Product.create({p_sku, p_name, p_description, p_price, p_last_update
            , p_serial_number, p_seller: {id, name, creation_date}})
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
    const menus = await Product.findOne({ p_status: 'En stock' })
    res.status(200).json(menus)
}