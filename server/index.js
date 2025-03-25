import app from "./app.js"
import { buildAdminJS } from "./config/setup.js"
import connectDB from "./db/index.js"
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})


connectDB()
    .then(async () => {
        app.on("error", (error) => {
            console.log("ERR", error);
            throw error
        })

        await buildAdminJS(app)

        app.listen(process.env.PORT || 8000, () => {
            console.log(`server is runing at port : http://localhost:${process.env.PORT }/admin`);
        })
    })
    .catch((error) => {
        console.log("MONGO DB & server connection failed!!!", error);
    })

