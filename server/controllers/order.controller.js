import orders from "razorpay/dist/types/orders.js";
import { ApiResponse } from "../config/ApiResponse.js";
import { asyncHandler } from "../config/asyncHandler.js";
import Razorpay from "razorpay"
import crypto from "crypto"
import { ApiError } from "../config/ApiError.js";
import Transaction from "../models/transaction.model.js";
import Order from "../models/order.model.js";
import products from "razorpay/dist/types/products.js";




const createTransaction = asyncHandler(async (req, res) => {
    const { amount, userId } = req.body;


    const razorpay = new Razorpay({
        key_id: process.env.RAZOR_PAY_KEY_ID,
        key_secret: process.env.RAZOR_PAY_SECRET
    })

    const options = {
        amount: amount,
        currency: "INR",
        receipt: `receipt#${Date.now()}`
    }

    if (!amount || !userId) {
        return res.status(400).json(ApiResponse(400, {}, "Amount and user id required"))
    }


    const razorpayOrder = await razorpay.orders.create(options)

    return res.status(201).json(new ApiResponse(201, {
        key: process.env.RAZOR_PAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id
    }, "Order created successfully"))
})

const createOrder = asyncHandler(async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        userId,
        cartItems,
        deliveryDate,
        address
    } = req.body;

    const key_secret = process.env.RAZOR_PAY_SECRET;

    const generate_signature = crypto.createHmac('sha256', key_secret)
        .update(razorpay_order_id + "" + razorpay_payment_id)
        .digest('hex')

    if (generate_signature === razorpay_signature) {
        try {
            const transaction = await Transaction.create({
                user: userId,
                orderId: razorpay_order_id,
                status: "Success",
                amount: cartItems.reduce((total, item) => total + item?.quantity * item.price, 0)
            });

            const order = await Order.create({
                user: userId,
                address,
                deliveryDate,
                items: cartItems?.map((item) => (
                    {
                        product: item?._id,
                        quantity: item?.quantity
                    }
                )),
                status: "Order Placed"
            })

            transaction.order = order._id;
            await transaction.save();

            return res.status(201).json(new ApiResponse(201, order, "Payment Verified and Order created"))
        } catch (error) {
            return res.status(500).json(new ApiError(500, "Failed to create trnasaction or order", error))
        }
    }
})

const getOrdersByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        throw new ApiError(400, "User id is required");
    }

    const orders = await Order.find({ user: userId })
        .populate("user", "name email")
        .populate("items.product", "name price image_uri ar_uri")
        .sort({ createdAt: -1 })

})


export { createTransaction, createOrder, getOrdersByUserId }