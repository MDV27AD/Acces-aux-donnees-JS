import { Product } from '../models/product.model.js'

export const createProduct = async (req, res) => {
    const { serialNumber: product_serial_number, sku: product_sku, name: product_name, description: product_description
        , supplierName: seller_name, supplierCreatedAt: seller_creation_date, price, update } = req.body
    const category = req.body['category']?.toLowerCase()
    // Verify if category is valid
    if (['jeu vidéo','jeu vidéos','jeu de société'].includes(category)){
        const data = {
            product : {product_sku, product_serial_number, product_name, product_description
                , product_price: parseFloat(price) + (price * (category.includes('jeu vidéo') && 10 || 15)/100)},
            seller : {seller_name, seller_creation_date}
        }
        // Verify if product exists
        const productFound = await Product.findOne({'product.product_serial_number': product_serial_number})
        if (productFound) {
            if (update) {
                for (const dataKey in data) {
                    productFound[dataKey] = data[dataKey]
                }
                // Return the updated product
                return res.status(201).json({message: 'Product updated successfully', product: await productFound.save()})
            }
            return res.status(400).json({
                message: `A product with serial number ${product_serial_number} exists.`,
                product: productFound
            })
        }
        // Create new product
        const newProduct = await new Product(data)
        // Return the newly created product
        return res.status(201).json({message: 'Product created successfully', product: await newProduct.save()})
    }
    return res.status(400).json({ message: 'Invalid category' })
}

export const getAllProducts = async (_req, res) => {
    const products = await Product.find()
    res.status(200).json(products)
}

export const getAvailableProducts = async (_req, res) => {
    const products = await Product.find({ product: {product_status: 'available'} })
    res.status(200).json(products)
}