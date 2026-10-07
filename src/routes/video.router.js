import {Router} from 'express'
import{getAllVideos,getVideoById, updateAVideo, deleteVideo, publishAVideo,togglePublishStatus} from "../controllers/video.controller.js"
import upload from "../middlewares/multer.middleware.js"
import { verifyJwt } from '../middlewares/auth.middleware.js'
import {Video} from "../models/video.model.js"
const router = Router()

router.route("/getallvideos").get(getAllVideos)

router.route("/uploadvideo").post(
    verifyJwt,
    upload.fields([
        {
            name:"videofile",maxCount:1
        },
        {
            name:"thumbnail",maxCount:1
        }
    ]),publishAVideo
)

router.route("/video/:videoId").get(getVideoById);

router.route("/updateVideo/:videoId").patch(verifyJwt,upload.single("thumbnail"),updateAVideo)

router.route("/deletevideo/:videoId").patch(verifyJwt,deleteVideo)

router.route("/togglepublication/:videoId").patch(verifyJwt,togglePublishStatus)

export default router


