import {Router} from "express"
import { toggleCommentLike,toggleTweetLike,toggleVideoLike,getLikedVideos } from "../controllers/like.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"
const router = Router()

router.route("/togglelikevideo/:videoId").post(verifyJwt,toggleVideoLike)
router.route("/togglelikecomment/:commentId").post(verifyJwt,toggleCommentLike)
router.route("/toggleliketweet/:tweetId").post(verifyJwt,toggleTweetLike)
router.route("/getlikedvideos").get(verifyJwt,getLikedVideos)

export default router