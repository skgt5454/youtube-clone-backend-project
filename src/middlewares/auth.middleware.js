import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import jwt from "jsonwebtoken"

export const verifyJwt = asyncHandler(async(req,res,next)=>{ // yha res ka use aa hi nhi rha h abhi to ise htake _ likh skte h
     
    try {
        const token = req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"unauthorized access request");
        }
        
        // ab token hai to hme jwt se puchna pdega ki token is right or not
        const decodedToken = jwt.verify
        (token,
        process.env.ACCESS_TOKEN_SECRET
        );
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){throw new ApiError(401,"invalid accesstoken")}
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid access token")
    }
})











