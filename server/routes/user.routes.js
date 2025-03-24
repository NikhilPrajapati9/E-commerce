import { Router } from "express";
import { loginOrSignUp } from "../controllers/user.controller.js";

const router = Router();


router.route("/post").post(loginOrSignUp)



export default router