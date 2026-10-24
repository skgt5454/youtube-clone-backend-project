import mongoose from "mongoose"
import {User} from "../models/user.model.js"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apiError.js"
import {apiresponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
       const { userId} = req.params
       const channelexists = await User.exists({_id: userId})
       if(!channelexists)
       {
           throw new ApiError(404,"Channel not found")
       }

       const totalsubscribers = await Subscription.countDocuments({channel: userId})
       const totalvideos = await Video.countDocuments({owner:userId})

       const viewsresult = await Video.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group:{
                _id:null,
                totalViews:{$sum:"$views"}
            }
        }
       ]);

       const totalviews = viewsresult[0]?.totalViews || 0;
       const videoIds = await Video.find({owner:userId}).distinct("_id")
       const totallikes = await Like.countDocuments({video:{$in:videoIds}})
return res.status(200).json(new apiresponse(200,{totalsubscribers,totalvideos,totalviews,totallikes},"Channel stats fetched successfully"))
})
const getChannelVideos = asyncHandler(async (req, res) => {
    const {userId} = req.params
    const channelexists = await User.exists({_id:userId})

    if(!channelexists)
    {
        throw new ApiError(404, "channel is not found")
    }

    const channelvideos = await Video.find({owner:userId})

    if(channelvideos.length === 0)
    {
        return res.status(200).json(new apiresponse(200,channelvideos,"no videos found for the channel"))
    }

    return res.status(200).json(new apiresponse(200,channelvideos,"videos are found"))


})

export {
    getChannelStats, 
    getChannelVideos
}
