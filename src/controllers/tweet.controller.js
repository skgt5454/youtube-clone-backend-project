import mongoose,{ isValidObjectId } from "mongoose";
import {Tweet} from "../models/tweets.model.js"
import { ApiError } from "../utils/apiError.js";
import {apiresponse} from "../utils/apiResponse.js"
import {Video} from "../models/video.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async(req,res)=>{
    const {content} = req.body;
    const { videoId } = req.params
    if(!videoId)
    {
        throw new ApiError(400,"video is not uploaded available")
    }
    const video = await Video.findById(videoId)

    if(!video)
    {
        throw new ApiError(400,"videoid is not available in database")
    }
    if(!content || !content.trim())
    {
        throw new ApiError(400,"content is not available")
    }
    const tweet = await Tweet.create({
        content:content,
        owner:req.user._id,
        video:videoId
    })
    return res.status(201).json(new apiresponse(201,tweet,"tweet is created successfully"))
})
const getUserTweets = asyncHandler(async (req, res) => {
    const tweets = await Tweet.find({owner:req.user._id})

    if(tweets.length === 0)
    {
        throw new ApiError(400,"tweets are not avilavle for the user")
    }

    return res.status(200).json(new apiresponse(200,tweets,"tweets of the user are available"))
})
const updateTweet = asyncHandler(async (req, res) => {
    const {newcontent} = req.body
    const {tweetId} = req.params
    const tweetupdate = await Tweet.findByIdAndUpdate({_id:tweetId,owner:req.user._id},{
        $set:{
            content:newcontent
        }
    },
{
   new:true
})
    if(!tweetupdate)
    {
        throw new ApiError(400,"tweet is not update");
    }
    return res.status(200).json(new apiresponse(200,tweetupdate,"tweet is updated"))
})
const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    
    const deletedTweet = await Tweet.findOneAndDelete({_id:tweetId,owner:req.user._id})
    // yha sirf tweet ka owner hi tweet ko delete kr skta ha
    if(!deletedTweet)
    {
        throw new ApiError(404,"tweet is not delete")
    }

    return res.status(200).json(new apiresponse(200,"tweet  is deleted"))
})
export {
    createTweet,getUserTweets,updateTweet,deleteTweet
}