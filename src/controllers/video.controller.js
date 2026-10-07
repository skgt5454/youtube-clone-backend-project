import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/apiError.js"
import { apiresponse } from "../utils/apiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { asyncHandler } from "../utils/asyncHandler.js"
const getAllVideos= asyncHandler(async(req,res)=>{
   const {page = 1,limit = 10,query , sortBy , sortType = "desc", userId} = req.query
   console.log(req.query)

   const filter ={};
   if(userId){filter.owner = userId}
   if(query)
   {
    filter.$or =
    [
        {
            title:{$regex:query},options:"i"
        },
        {
            description:{$regex:query,$options:"i"}
        }
    ]
   }
   const sortOptions = {};

   sortOptions[sortBy] = sortType === "asc" ? 1 : -1;
   const videos = await Video.find(filter).skip((Number(page)-1)*Number(limit)).limit(Number(limit)).sort(sortOptions)

   if(!videos || videos.length == 0)
   {
      throw new ApiError(400,"videos not found!")
   }
return res.status(200).json(new apiresponse(200,videos,"videos found successfully"))
})
const publishAVideo = asyncHandler(async(req,res)=>{
    const { title,description } = req.body
    const thumbnaillocalpath = req.files?.thumbnail?.[0]?.path
    const videolocalpath = req.files?.videofile?.[0]?.path
    if(!thumbnaillocalpath)
    {
        throw new ApiError(400,"thumbnail is not uploaded")
    }
    if(!videolocalpath)
    {
        throw new ApiError(400,"video is not uploaded by user");
    }
    const cloudvideo = await uploadOnCloudinary(videolocalpath)
    const thumbnail = await uploadOnCloudinary(thumbnaillocalpath);
    if(!cloudvideo)
    {
        throw new ApiError(400,"video is not uploaded on cloudinary");
    }

    if(!thumbnail)
    {
        throw new ApiError(400,"thumbnail is not upload on cloudinary")
    }

    const video = await Video.create(
        {
            videofile : {
                url:cloudvideo?.url || "",
                public_id:cloudvideo?.public_id || ""
             },
            title,
            description,
            thumbnail : thumbnail?.url || "",
            views:0,
            ispublished:true,
            owner : req.user._id,
            duration : cloudvideo?.duration
        }
    )
    return res.status(200).json(new apiresponse(200,video,"video uploaded is successfully"))
})
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId)

    if(!video)
    {
        throw new ApiError(400,video,"video is not found");
    }

    return res.status(200).json(new apiresponse(200,video,"get a video by videoid is successfully"))
})
const updateAVideo  = asyncHandler(async (req,res)=>{
    const { videoId } = req.params;
    
    const {title,description} = req.body
    const thumbnaillocalpath = req.file?.path
    if(!thumbnaillocalpath){throw new ApiError(400,"thumbnial is requires");}

    const thumbnail = await uploadOnCloudinary(thumbnaillocalpath);
    if(!thumbnail)
    {
        throw new ApiError(400,"thumbnail file is not upload on cloudinary correctly")
    }

    const video = await Video.findByIdAndUpdate(
        {
            _id:videoId,
            owner:req.user._id
        },
        {
           $set:{
                  title:title,
                  description:description,
                  thumbnail:thumbnail?.url
           }
        },
        {
            new:true
        }
    )
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
 return res.status(200).json(new apiresponse(200,video,"video is updated successfully"))

})
const deleteVideo = asyncHandler(async (req,res)=>{
    const { videoId } = req.params
    const video = await Video.findOne({_id:videoId,
        owner:req.user._id
    })

    if(!video){throw new ApiError(404,"video not found")}
    
    const videopublicid = video.videofile.public_id
    await cloudinary.uploader.destroy(videopublicid,{resource_type:"video"})
    video.videofile = null;

    const updatevideo = await video.save({validateBeforeSave:false})
return res.status(200).json(new apiresponse(200,updatevideo,"video deletion is successfully done"))
})
const togglePublishStatus = asyncHandler(async(req,res)=>{
    const { videoId } = req.params
    const video = await Video.findOne({
        _id:videoId,
        owner:req.user._id
    }
)
    
    if(!video)
    {
        throw new ApiError(400,"video is not found");
    }

    video.isPublished = !video.isPublished
    const updatevideo = await video.save()
return res.status(200).json(new apiresponse(200,updatevideo,"togglepublishstatus is updated"))
})
export {updateAVideo,getAllVideos,publishAVideo,getVideoById,deleteVideo,togglePublishStatus}













