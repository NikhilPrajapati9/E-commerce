import { ApiResponse } from "../config/ApiResponse";
import { asyncHandler } from "../config/asyncHandler.js";
import Category from "../models/category.model.js";



const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();

    return res.status(200).json(ApiResponse(200, categories));
})

export { getAllCategories }