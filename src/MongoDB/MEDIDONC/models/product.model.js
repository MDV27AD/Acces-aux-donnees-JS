import mongoose, {model} from 'mongoose'
import {de} from "@faker-js/faker";

const {Schema} = mongoose

// Je crée un schema
const ProductSchema = new Schema(
    {
        p_sku: {type: String, required: true},
        p_serial_number: {type: String, required: true, unique: true},
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
                rec.sku = rec.p_sku
                rec.serialNumber = rec.p_serial_number
                rec.name = rec.p_name
                rec.description = rec.p_description
                rec.price = rec.p_price
                rec.category = rec.p_category
                rec.supplierName = rec.p_seller?.name
                rec.inStock = rec.p_status === 'En stock'
                delete rec.__v
                delete rec._id
                delete rec.createdAt
                delete rec.updatedAt
                delete rec.p_sku
                delete rec.p_serial_number
                delete rec.p_name
                delete rec.p_description
                delete rec.p_price
                delete rec.p_category
                delete rec.p_last_update
                delete rec.p_status
                delete rec.p_seller
            }
        }
    }
)

export const Product = model('product', ProductSchema)
