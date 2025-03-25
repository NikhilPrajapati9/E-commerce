import dotenv from "dotenv"
import mongoose from "mongoose"
import Product from "./models/product.model.js"
import Category from "./models/category.model.js"
import { categoryData, productData } from "./seedData.js"
import { DB_NAME } from "./constant.js"

dotenv.config()

async function seedDatabase() {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)

        await Product.deleteMany({});
        await Category.deleteMany({});

        const categoryDocs = await Category.insertMany(categoryData);

        const categoryMap = categoryDocs.reduce((map, category) => {
            map[category.name] = category._id
            return map
        }, {})

        console.log("categoryMap =>", categoryMap);


        const productsWithCategoryId = productData.map((product) => ({
            ...product,
            category: categoryMap[product.category]

        }))
        // console.log("productsWithCategoryId =>", productsWithCategoryId);

        const productDocs = await Product.insertMany(productsWithCategoryId);

        for (const product of productDocs) {
            await Category.updateOne(
                { _id: product.category },
                { $push: { products: product._id } } // Push product ID to category's products array
            );
        }

        console.log("DATABASE SEED SECCESSFULLY");
    } catch (error) {
        console.error("Error Seeding database :", error)
    } finally {
        mongoose.connection.close();
    }
}

seedDatabase();