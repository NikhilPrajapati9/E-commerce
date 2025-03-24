import mongoose, { Schema } from "mongoose";



const ItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    quantity: { type: Number, required: true }
})

const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    deliveryDate: { type: Date, required: true },
    address: { type: String },
    items: { type: [ItemSchema], required: true },
    status: {
        type: String,
        enum: [
            "Order Placed",
            "Shipping",
            "Out of Delivery",
            "Delivery",
            "Cancelled"
        ],
        default: "Order Placed",
        required: ture
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const Order = mongoose.model("Order", OrderSchema);

export default Order