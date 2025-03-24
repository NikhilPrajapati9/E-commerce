import { Router } from "express";
import { getProductByCategoryId } from "../controllers/product.controller.js";

const router = Router();


router.route("/:categoryId").get(getProductByCategoryId)



export default router