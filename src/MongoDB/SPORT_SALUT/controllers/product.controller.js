import { Product } from '../models/product.model.js'

export const createProduct = async (req, res) => {
    const { sku: sku_produit, name: nom_produit, description: description_produit, serialNumber: serial_number_produit
        , sellerName: nom_fournisseur, price, category, update, stocked } = req.body
    // Verify if the category is sport
    if (category?.toLowerCase()?.includes('sport')){
        const data = { sku_produit, serial_number_produit, nom_produit, description_produit, nom_fournisseur
            , prix: parseFloat(price) + (price * 20 / 100), en_stock: stocked && 'Oui' || 'Non' }
        // Verify if product exists
        const productFound = await Product.findOne({serial_number_produit})
        if (productFound) {
            if (update) {
                for (const dataKey in data) {
                    productFound[dataKey] = data[dataKey]
                }
                // Return the updated product
                return res.status(201).json({message: 'Product updated successfully', product: await productFound.save()})
            }
            return res.status(400).json({
                message: `A product with serial number ${serial_number_produit} exists.`,
                product: productFound
            })
        }
        // Create new product
        const newProduct = await new Product(data)
        // Return the newly created product
        return res.status(201).json({message: 'Product created successfully', product: await newProduct.save()})
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