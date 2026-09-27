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
        const {newaccessToken,newrefreshToken}= await generateRefreshTokenAndAccesstoken(user._id);
    
        return res.status(200).cookie("accessToken",newaccessToken,options).cookie("refreshToken",newrefreshToken,options).json(new apiresponse(200,{accessToken:newaccessToken,refreshToken:newrefreshToken},"refreshToken accessed successfully"))
    
    } catch (error) {
        throw new ApiError(401,error?.message,"invalid refreshToken")
    }
}) 
const changeCurrentPassword = asyncHandler(async(req,res)=>
{
    const {oldPassword,newPassword} = req.body
    console.log(req.user);
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.ispasswordCorrect(oldPassword);
    if(!isPasswordCorrect)
    {
        throw new ApiError(400,'invalid old password');
    }
    user.password = newPassword
    user.save({validationBeforeSave:false})

    return new apiresponse(200,{},"password is changed")
})
const getcurrentUser = asyncHandler(async(req,res)=>
{
    res.status(200).json(200,req.user,"current user fetched successfully")
})
const updateAccountDetails = asyncHandler(async(req,res)=>{
   const {fullName,email} = req.body;

   if(!fullName || !email)
   {
    throw new ApiError(400,"all fields are required");
   }

   const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
        $set:
        {
            fullName,
            email:email
        }
    },
    {
            new:true
    }
   ).select(-password)
   return res.status(200).json(new apiresponse(200,user,"account details update successfully"));
})
const updateUserAvatar = asyncHandler(async(req,res)=>{
    console.log(req.file);
    const avatarlocalpath = req.file?.path

    if(!avatarlocalpath){throw new ApiError(400,"avatar file is missing")}

    const avatar = await uploadOnCloudinary(avatarlocalpath);

    if(!avatar.url){throw new ApiError(400,"error while uploading the avatarlocalpath")}
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url // idhar avatar h wo cloudinay ka url h
            }
        },
        {
            new:true
        }

    ).select("-password")
    res.status(200).json(new apiresponse(200,user,"avatar file is successfully updated"));

})
const oldAvatarDeleted = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);
     if(!user.avatar){
        throw new ApiError(400,"user doesn't have a avatar to delete");
     }

    const avatarPublicid = user.avatar.public_id;// cloudinary se file delete krne ke liye hme public id chahiye hoti h. aur user.avatar me sirf url h. to hme public id ko save krna hoga jab hm file upload kr rhe h cloudinary pe. to hmne user model me avatar field ko object banaya jisme url and public_id dono save ho rhe h.
    if(!avatarPublicid){throw new ApiError(400,"avatar public id is missing")}
    await cloudinary.uploader.destroy(avatarPublicid,{resource_type : "image"})
    user.avatar = null;

    const updateuser = await user.save({validateBeforeSave:false})

    return res.status(200).json(new apiresponse(200,updateuser,"avatar is deleted successfully"));
})
const updateUserCoverImage = asyncHandler(async(req,res)=>{
    const CoverImagelocalpath = req.file?.path

    if(!CoverImagelocalpath){throw new ApiError(400,"avatar file is missing")}

    const coverImage = await uploadOnCloudinary(CoverImagelocalpath);

    if(!coverImage.url){throw new ApiError(400,"error while uploading the CoverImagelocalpath")}

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:coverImage.url //MongoDB ke coverImage field ko Cloudinary ke URL se update karo. monngodb me only coverImage and avtar ka url rhta hai
            }
        },
        {
            new:true
        }
    ).select("-password")
    res.status(200).json(new apiresponse(200,user,"avatar file is successfully updated"));
})
const getUserChannelProfile = asyncHandler(async(req,res)=>{
  const {username} = req.params;
  if(!username?.trim()){
    throw new ApiError(400,"username is required")
  }
  const channel = await User.aggregate([
    {
        $match:{
            username:username?.toLowerCase()
        }
    },
    //subscribers
    {
        $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"channel",
            as:"subscribers"
        }
    },
    //subscribed
    {
        $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"subscriber",
            as:"subscribedTo"
        }
    },
    // ab hum kuch fields aur add kr rhe h original User object me jo ki subscribersCount,channelsSubscribedToCount and isSubscribed
    {
        $addFields:{
            subscribersCount:{$size:"$subscribers"},
            channelsSubscribedToCount:{$size:"$subscribedTo"},
            isSubscribed:{ // ye isliye use kiya taaki pta lg ske ki hmne already subscribed kr rkha h ya nhi kisiko
                $cond:{
                    if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                    then: true,
                    else: false
                }
            }
        } 
    },
    // ab hum project field use kr rhe h kyunki yha hme kuch fields hi chahiye h original User object me se. aur baki fields ko remove krna h. to hum $project use kr rhe h
    {
        $project:{
            fullname:1,
            username:1,
            subscribersCount:1,
            channelsSubscribedToCount:1,
            isSubscribed:1,
            avatar:1,
            coverImage:1,
            email:1
        }

    }
  ])
  //idhar check krenge ki channel array empty h ya nhi. agr empty h to iska matlab h ki koi bhi user nhi mila jiska username hmne req.params me diya h. to hm 404 error throw krenge
  if(!channel?.length){throw new ApiError(404,"channel not found")}
 console.log(channel);
 return res.status(200).json(new apiresponse(200,channel[0],"channel profile fetched succesfullly"))
})
// interview important question ki req.user._id kya return krta hai -> ye deta h ek string , jaise ki mongodb me _id:ObjectId('54ds5f77d511f5ds1dsd84f1f') aisi kuch id hoti h but ye jo sirf string hai ObjectId ke andar ye id nhi hai. hm use kr rhe h mongoose so ye mongoose automatically convert kr deta h string ko mongodb ki ObjectId me. to agr hmne req.user._id ko mongoose ke kisi bhi method me pass kiya to ye automatically convert ho jaega ObjectId me. to ye ek string return krta h jo ki mongodb ke _id field ke liye unique hoti h.
const getWatchHistory = asyncHandler(async(req,res)=>{
    const user = await User.aggregate([
        {
            $match:{
                // _id:req.user?._id ye error aayega kyunki yha mongoose kam nhi krta aggregation pipeline ka jitna code h vo directly hi jata h to hme use krna hoga mongoose.Types.ObjectId(req.user?._id) taaki ye string ko ObjectId me convert kr de
              _id: new mongoose.Types.ObjectId(req.user?._id) // hmne new kyu use kiya h
            }
        },

        {
            $lookup:{
                from:"Video",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"user",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                         fullName:1,
                                         username:1,
                                         avatar:1
                                    }
                                }
                            ]
                        }
                    },
                    // ye wali pipeline mene iskiye use ki h taaki owner array me sirf ek hi object hoga.
                    {
                        $owner:{$first:"$owner"}
                    }
                ]
            }
        }
    ])
    return res.status(200).json(new apiresponse(200,user[0].watchHistory,"watch history fetched successfully"))
})

export { registerUser,loginUser,logoutUser,refreshAccessToken,updateAccountDetails,getcurrentUser,changeCurrentPassword,updateUserAvatar,oldAvatarDeleted,updateUserCoverImage,getUserChannelProfile } 
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