import { Router } from "express";
import { createOrder, createTransaction, getOrdersByUserId } from "../controllers/order.controller";

const router = Router();


router.route("/transaction").post(createTransaction)
router.route("/:userId").get(getOrdersByUserId);
router.route("/").post(createOrder);




export default router