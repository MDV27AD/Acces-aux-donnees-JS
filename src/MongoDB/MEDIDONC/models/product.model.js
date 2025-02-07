import mongoose, {model} from 'mongoose'

const {Schema} = mongoose

// Je crée un schema
const ProductSchema = new Schema(
    {
        p_sku: {type: String, required: true},
        p_serial_number: {type: Number, required: true, unique: true},
        p_price: {type: Number},
        p_name: {type: String, required: true},
        p_description: {type: String},
        p_category: {type: String},
        p_last_update: {type: Date, default: Date.now},
        p_status: {type: String, enum: ['En stock', 'Rupture de stock'], default: 'En stock'},
        p_seller: {id: Number, name: String, creation_date: Date}
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
