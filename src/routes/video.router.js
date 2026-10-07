import {Router} from 'express'
import{uploadAVideo,getVideoById, updateVideo, deleteVideo, publishAVideo} from "../controllers/video.controller.js"
import upload from "../middlewares/multer.middleware.js"
import { verifyJwt } from '../middlewares/auth.middleware.js'

const router = Router()

router.route("/uploadvideo").post(
    verifyJwt,
    upload.fields([
        {
            name:"videofile",maxCount:1
        },
        {
            name:"thumbnail",maxCount:1
        }
    ]),uploadAVideo
)
router.route("uploadvideo").post(publishAVideo)
router.route("/video/:videoId").get(getVideoById);

router.route("/updateVideo/:videoId").patch(verifyJwt,upload.single(thumbnail),updateVideo)

router.route("/togglepublication/:videoId").patch(verifyJwt,togglePublishStatus)

router.route("deletevideo/:videoId").patch(verifyJwt,deleteVideo)

export default router


