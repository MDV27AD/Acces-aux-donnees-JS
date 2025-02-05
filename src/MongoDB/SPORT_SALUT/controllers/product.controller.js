import { Product } from '../models/product.model.js'

export const createProduct = async (req, res) => {
    const { sku: sku_produit, name: nom_produit, description: description_produit, serialNumber: serial_number_produit
        , sellerName: nom_fournisseur, price, category } = req.body
    // Verify if the category is sport
    if (category.includes('sport')){
        // Verify if product exists
        const productFound = await Product.find({serial_number_produit})
        if (productFound)
            return res.status(400).json({ message: `A product with serial number ${serial_number_produit} exists.`, product: productFound})
        // Create new product
        const product = await Product.create({ sku_produit, serial_number_produit, nom_produit
            , description_produit, nom_fournisseur, prix: price + (price * 20 / 100) })
        // Return the newly created product
        return res.status(201).json(product)
    }
    return res.status(400).json({ message: 'The category is not sport' })
}

export const getAllProducts = async (_req, res) => {
    const menus = await Product.find()
    res.status(200).json(menus)
}

export const getAvailableProducts = async (_req, res) => {
    const menus = await Product.find({ en_stock: 'Oui' })
    res.status(200).json(menus)
}