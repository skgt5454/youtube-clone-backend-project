import {Router} from 'express'
import { getChannelStats,getChannelVideos } from '../controllers/userdashboard.controller.js'
import { verifyJwt } from '../middlewares/auth.middleware.js'

const router = Router();

router.route("/getchannelstatus").get(verifyJwt,getChannelStats)

router.route("/getChannelVideos").get(verifyJwt,getChannelVideos)

export default router

