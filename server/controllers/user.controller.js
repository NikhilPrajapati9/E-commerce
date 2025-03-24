import { ApiResponse } from "../config/ApiResponse";
import { asyncHandler } from "../config/asyncHandler";
import User from "../models/user.model";
import jwt from "jsonwebtoken"

const generateToken = (user) => {
    const accessToken = jwt.sign(
        { userId: user?._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "2d" }
    )

    const refreshToken = jwt.sign(
        { userId: user?.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    )
}




const loginOrSignUp = asyncHandler(async (req, res) => {
    const { phone, address } = req.body;

    let user = await User.findOne({ phone });

    if (!user) {
        user = new User({
            address, phone
        })
        await user.save();
    } else {
        user.address = address;
        await user.save();
    }

    const { accessToken, refreshToken } = generateToken(user.toObject());

    return res.status(200).json(ApiResponse(200, { user, accessToken, refreshToken }))
})



export { loginOrSignUp }