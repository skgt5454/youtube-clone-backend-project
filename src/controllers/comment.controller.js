import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/apiError.js"
import {apiresponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const comments = await Comment.find({_id:videoId}).skip((Number(page) - 1)*Number(limit)).limit(Number(limit))

    if(!comments || comments.length == 0)
    {
        throw new ApiError(400,"comments not found")
    }

    return res.status(200).json(new apiresponse(200,comments,"comments are found successfully"))
})
const addComment = asyncHandler(async (req, res) => {
    const {content} = req.body
    const { videoId } = req.params
    if(!videoId){throw new ApiError(400,"videoid is not upload by the client")}
    const comments = await Comment.create({
        content:content || "",
        video:videoId,
        owner:req.user._id
    })
    return res.status(200).json(new apiresponse(200,comments,"comment is added in the video successfully"))
})
const updateComment = asyncHandler(async (req, res) => {
    const{ commentId } = req.params
    const {content} = req.body
    if(!commentId){throw new ApiError(400,"commentId is not upload by the client")}

    if(!content?.trim())
    {
        throw new ApiError(400,"content is invalid")
    }
    const updateComment = await Comment.findByIdAndUpdate({_id:commentId,owner:req.user._id},
        {
            content:content
        },
        {
            new:true
        }
    )
    if(!updateComment){throw new ApiError(400,"comment is not updated")}
    return res.status(200).json(new apiresponse(200,updateComment,"comment update is successfully"))
})
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if(!commentId){throw new ApiError(400,"commentId is not uploaded by user")}

    const commentdelete = await Comment.findOneAndDelete({_id:commentId,owner:req.user._id})

    if(!commentdelete)
    {
        throw new ApiError(400,"comment is not found you are not the owner")
    }

    return res.status(200).json(new apiresponse(200,"comment is deleted successfully"))
})
export {
    getVideoComments,addComment, updateComment,deleteComment
}