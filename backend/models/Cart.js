// models/Cart.js
// Shopping cart for buyers.
// One cart per buyer — items reference products and sellers.

import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema({
    product: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'Product',
        required: true,
    },
    seller: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'Seller',
        required: true,
    },
    quantity: {
        type:    Number,
        default: 1,
        min:     1,
    },
    priceAtAdd: {
        type:     Number,
        required: true,
    },
})

const cartSchema = new mongoose.Schema(
    {
        buyer: {
            type:     mongoose.Schema.Types.ObjectId,
            ref:      'Buyer',
            required: true,
            unique:   true,
        },
        items: [cartItemSchema],
    },
    { timestamps: true }
)

const Cart = mongoose.model('Cart', cartSchema)
export default Cart