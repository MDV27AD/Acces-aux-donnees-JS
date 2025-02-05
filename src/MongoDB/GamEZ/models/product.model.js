import mongoose, {model} from 'mongoose'

const {Schema} = mongoose

// Je crée un schema
const ProductSchema = new Schema(
    {
        product: {
            product_sku: {type: String, required: true},
            product_serial_number: {type: String, required: true, unique: true},
            product_name: {type: String, required: true},
            product_description: {type: String},
            nom_fournisseur: {type: String},
            product_price: {type: Number, required: true},
            product_status: {type: String, enum: ['available', 'unavailable'], default: 'available'}
        },
        seller: {
            seller_name: {type: String, required: true},
            seller_creation_date: {type: Date, default: Date.now},
        }
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
