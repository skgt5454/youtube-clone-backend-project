import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js"
//import upload  from "../middlewares/multer.middleware.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {apiresponse} from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"
const generateRefreshTokenAndAccesstoken = async(userId)=>
{
    try{
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    }
    catch(error)
    {
        console.log(error)
        throw new ApiError(500,"something went wrong while generating access token and refresh token",error)
    }
}
const registerUser = asyncHandler(async (req, res) => {

    const { username, fullname, email, password } = req.body
    // console.log(username);

    if ([username, fullname, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "all fields are compulsory")
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }] })
    //console.log(existedUser) 
    if (existedUser) {
        throw new ApiError(409, "user is already exist")
    }
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length>0)
    {
      coverImageLocalPath = req.files.coverImage[0].path
    }
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path
    
    if (!avatarLocalPath) { throw new ApiError(400, "avatar file required") }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);// agr yha hmm agr coverImage nhi ho rha to ye empty string de rha h h error nhi de rha
    
    if (!avatar) { throw new ApiError(400, "avatar file is not upload") }

    const user = await User.create(
        {
            fullname,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        }
    )
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
     if(!createdUser){throw new ApiError(500,"something went wrong whle register the user")}

    return res.status(200).json(
    (new apiresponse(200,createdUser,"first user is registered successfully"))
)
})
const loginUser = asyncHandler(async(req,res)=>{
    const {username,email,password} = req.body
    console.log(email);
    if(!username && !email)
    {
        throw new ApiError(400,"username or email is required")
    }
    const user = await User.findOne({
        $or:[{username},{email}]
    })
    if(!user)
    {
        throw new ApiError(404,"user doesn't exist")
    }
    const ispasswordvalid = await user.ispasswordCorrect(password)
    if(!ispasswordvalid){throw new ApiError(401,"invalid user credentials")}

    const {refreshToken,accessToken} = await generateRefreshTokenAndAccesstoken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).
    json(new apiresponse(200,{
        user:loggedInUser,accessToken,refreshToken
    }," User loggedIn successfully"))
})
const logoutUser = asyncHandler(async(req,res)=>{
  User.findByIdAndUpdate(
    req.user._id,
    {
        $set:{
            refreshToke:undefined
        }
    },
    {
        new:true
    }
  )
   const options = 
    {
        httpOnly:true,
        secure:true
    }
    return res.status(200).clearCookie("accessToken",options)
    .clearCookie("refreshToken",options).json(new apiresponse(200,{},"user logged out"))
})
const refreshAccessToken =asyncHandler(async(req,res)=>
{
    try {
        const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken
        if(!incomingRefreshToken)
        {
            throw new ApiError(400,"unauthorized access");
        }
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){throw new ApiError(401,"invalid refreshToken")}
    
        if(incomingRefreshToken!==user?.refreshToken)
        {
            throw new ApiError(401,"refreshToken is expired or not");
        }
    
        const options = {
            httpOnly:true,
            secure:true
        }
        const {accessToken,newrefreshToken}= await generateRefreshTokenAndAccesstoken(user._id);
    
        return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",newrefreshToken,options).json(new apiresponse(200,{accessToken,refreshToken:newrefreshToken},"refreshToken accessed successfully"))
    
    } catch (error) {
        throw new ApiError(401,error?.message,"invalid refreshToken")
    }
}) 
export { registerUser,loginUser,logoutUser,refreshAccessToken }


// Request
//    ↓
// upload.fields()
//    ↓
// Multer request se files uthata hai
//    ↓
// req.files me daalta hai
//    ↓
// registerUser()
//    ↓
// console.log(req.files)


// if  const { username, fullname, email, password } = req.body;
// so in js automatic is->
// const username = req.body.username;
// const fullname = req.body.fullname;
// const email = req.body.email;
// const password = req.body.password;


//console.log(req.files)=>
//     [Object: null prototype] {
//   avatar: [
//     {
//       fieldname: 'avatar',
//       originalname: 'mahadev.jpg',
//       encoding: '7bit',
//       mimetype: 'application/octet-stream',
//       path: 'public\\temp\\mahadev.jpg',
//       destination: './public/temp',
//       filename: 'mahadev.jpg',
//       size: 107995
//     }
//   ]