import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/apiError.js"
import {apiresponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const comments = await Comment.find({video:videoId}).skip((Number(page) - 1)*Number(limit)).limit(Number(limit))

    if(!comments || comments.length == 0)
    {
        throw new ApiError(400,"comments not found")
    }

    return res.status(200).json(new apiresponse(200,comments,"comments are found successfully"))
})
const addComment = asyncHandler(async (req, res) => {

    const { videoId } = req.params

})
const updateComment = asyncHandler(async (req, res) => {
})
const deleteComment = asyncHandler(async (req, res) => {
})
export {
    getVideoComments,addComment, updateComment,deleteComment
}