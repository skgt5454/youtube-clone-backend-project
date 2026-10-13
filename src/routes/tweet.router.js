import { Router } from "express"
import { createTweet,getUserTweets,updateTweet,deleteTweet } from "../controllers/tweet.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"
const router = Router()

router.route("/tweetcreate/:videoId").post(verifyJwt,createTweet)

router.route("/getusertweets").get(verifyJwt,getUserTweets)

router.route("/updateTweet/:tweetId").patch(verifyJwt,updateTweet)

router.route("/deleteTweet/:tweetId").patch(verifyJwt,deleteTweet)

export default router