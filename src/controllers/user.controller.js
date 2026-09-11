import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js"
// import upload  from "../middlewares/multer.middleware.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {apiresponse} from "../utils/apiResponse.js"
const registerUser = asyncHandler(async (req, res) => {

    const { username, fullname, email, password } = req.body
    // console.log(username);

    if ([username, fullname, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "all fields are compulsory")
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }] })
    console.log(existedUser)
    if (existedUser) {
        throw new ApiError(409, "user is already exist")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    //  console.log(avatarLocalPath)
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path
    // console.log(req.files)
     if (!avatarLocalPath) { throw new ApiError(400, "avatar file required") }

     if (!coverImageLocalPath) { throw new ApiError(400, "coverImage file required") }
    // console.log(avatarLocalpath)
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) { throw new ApiError(400, "avatar file is not upload") }

    const user = await User.create(
        {
            fullname,
            avatar: avatar.url,
            coverImage: coverImage?.url || " ",
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
    (new apiresponse(200,createdUser,"something went wrong while registering the user"))
)
})
export { registerUser }
// //Request
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
//   ],