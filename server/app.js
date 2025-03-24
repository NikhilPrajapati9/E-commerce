import express from "express";
import userRoutes from "./routes/user.routes.js"
import categoryRoutes from "./routes/category.routes.js"
import productRoutes from "./routes/product.routes.js"
import orderRoutes from "./routes/order.routes.js"
const app = express();

app.use(express.json())



//routes
app.use("/user", userRoutes)
app.use("/category", categoryRoutes)
app.use("/product", productRoutes)
app.use("/order", orderRoutes)






export default app
