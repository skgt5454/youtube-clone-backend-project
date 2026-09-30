import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/apiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
const videoUpload = asyncHandler(async(req,res)=>{

    const {thumbnail,description,title} = req.body

    if([thumbnail,description,title].some((field)=>field?.trim() === ""))
    {
        throw new ApiError(400,"all fields are required")
    }

    const videolocalpath = await req.files?.videofile?.[0].path
    
    const videoupload = await uploadOnCloudinary(videolocalpath);

    if(!videoupload)
    {
        throw new ApiError(400,"video is not upload on cloudinary yet")
    }
    const video = await Video.create({
        videofile: videoupload.url,
        thumbnail,
        description,
        title,
    })
    const createdvideo = await Video.findById(video._id);

    if(!createdvideo)
    {
        return res.status(200).json(new apiresponse(200,createdvideo,"video is ceated successfully"))
    }
})
const deletevideo = asynHandler(async(req,res)=>{

})
const updateVideo  = asyncHandler(async(req,res)=>{

})
const getallvideos = asynHandler(async(req,res)=>
{
   
})
const getvideoId = asyncHandler(async(req,res)=>{
})
export {videoUpload,getvideoId}


