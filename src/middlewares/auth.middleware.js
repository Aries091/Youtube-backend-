import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.models";

export const verifyJWT=asyncHandler(async (req, res, next) => {
try {
    const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
    
    if(!token){
        throw new ApiError(400,"unauthorized error")
    }
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    await User.findById(decodedToken?._id ).select("-password -refreshToken")
    
    if(!user)
        {
            throw new ApiError(401,"unauthorized error")
        }
    
        req.user =user;
        next();
    
} catch (error) {
    throw new ApiError(401,"invalid access")
    
}
})
