import { ApiResponse } from "../config/ApiResponse.js";
import { asyncHandler } from "../config/asyncHandler.js";
import Product from "../models/product.model.js";



const getProductByCategoryId = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;


    const products = await Product.find({ category: categoryId });

    if (!products || products.length === 0) {
       return res.status(404).json(ApiResponse(404, {}, "No Products found for this category"))
    }

    return res.status(200).json(ApiResponse(200, products))

})

export { getProductByCategoryId }