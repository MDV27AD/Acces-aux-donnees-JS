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
                delete rec.__v
                delete rec._id
                delete rec.createdAt
                delete rec.updatedAt
            }
        }
    }
)

export const Product = model('product', ProductSchema)
