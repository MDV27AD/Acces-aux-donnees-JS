import mongoose, {model} from 'mongoose'

const {Schema} = mongoose

// Je crée un schema
const ProductSchema = new Schema(
    {
        sku_produit: {type: String, required: true},
        serial_number_produit: {type: Number, required: true, unique: true},
        nom_produit: {type: String, required: true},
        description_produit: {type: String},
        nom_fournisseur: {type: String},
        category_produit: {type: String},
        prix: {type: Number, required: true},
        en_stock: {type: String, enum: ['Oui', 'Non'], default: 'Oui'}
    },
    {
        timestamps: true,
        toJSON: {
            transform(_doc, rec) {
                rec.id = rec._id
                rec.sku = rec.sku_produit
                rec.serialNumber = rec.serial_number_produit
                rec.name = rec.nom_produit
                rec.description = rec.description_produit
                rec.price = rec.p_prices
                rec.category = rec.p_category
                rec.supplierName = rec.nom_fournisseur
                rec.inStock = rec.en_stock === 'Oui'
                delete rec.__v
                delete rec._id
                delete rec.createdAt
                delete rec.updatedAt
                delete rec.sku_produit
                delete rec.serial_number_produit
                delete rec.nom_produit
                delete rec.description_produit
                delete rec.p_prices
                delete rec.p_category
                delete rec.nom_fournisseur
                delete rec.en_stock
            }
        }
    }
)

export const Product = model('product', ProductSchema)
