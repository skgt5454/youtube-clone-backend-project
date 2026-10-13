import {Like} from "../models/like.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {apiresponse} from "../utils/apiResponse.js"
import {ApiError} from "../utils/apiError.js"
import {Video} from "../models/video.model.js"
import {Tweet} from "../models/tweets.model.js"
import {Comment} from "../models/comments.model.js"
const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params

    const videof = await Video.findById(videoId)

    if(!videof){throw new ApiError(400,"video not found to like")}
    
    const alreadyliked = await Like.exists({video:videoId,likedBy:req.user._id})
    if(!alreadyliked)
    {
        const liked = await Like.create({
        video:videoId,
        likedBy: req.user._id
    })
    if(!liked)
    {
        throw new ApiError(400,"like is not on the video")
    }
    return res.status(200).json(new apiresponse(200,liked,"like is on the video"))
    }
    else
    {
        const removedlike = await Like.findOneAndDelete({video:videoId, likedBy:req.user._id})
        return res.status(200).json(new apiresponse(200,removedlike,"like is removed from video"))
    }
})
const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    const comment = await Comment.findById(commentId)
    if(!comment) {
        throw new ApiError(400,"comment not found to like")
    }
     const alreadyliked = await Like.exists({comment:commentId,likedBy:req.user._id})
    if(!alreadyliked)
    {
        const liked = await Like.create({
        comment:commentId,
        likedBy: req.user._id
    })
    if(!liked)
    {
        throw new ApiError(400,"like is not on the video")
    }
    return res.status(200).json(new apiresponse(200,liked,"like is on the video"))
    }
    else
    {
        const removedlike = await Like.findOneAndDelete({comment:commentId, likedBy:req.user._id})
        return res.status(200).json(new apiresponse(200,removedlike,"like is removed from comment"))
    }
})
const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const tweet = await Tweet.findById(tweetId)

    if(!tweet){throw new ApiError(400,"tweet not found to like")}
    
    const alreadyliked = await Like.exists({tweet:tweetId,likedBy:req.user._id})
    if(!alreadyliked)
    {
        const liked = await Like.create({
        tweet:tweetId,
        likedBy: req.user._id
    })
    if(!liked)
    {
        throw new ApiError(400,"like is not on the video")
    }
    return res.status(200).json(new apiresponse(200,liked,"like is on the video"))
    }
    else
    {
        const removedlike = await Like.findOneAndDelete({tweet:tweetId, likedBy:req.user._id})
        return res.status(200).json(new apiresponse(200,removedlike,"like is removed from tweet"))
    }
}
)
const getLikedVideos = asyncHandler(async (req, res) => {
    const {page, limit} = req.query

    const likedVideos = await Like.find({likedBy:req.user._id}).select({video: 1}).skip((Number(page) - 1)*Number(limit)).limit(Number(limit))
    if(likedVideos.length === 0){
        throw new ApiError(400,"no liked videos found")
    }
    return res.status(200).json(new apiresponse(200,likedVideos,"liked videos found"))
})
export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
