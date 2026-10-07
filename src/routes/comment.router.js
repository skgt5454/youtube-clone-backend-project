import {Router} from 'express'
import {getVideoComments,addComment, updateComment,deleteComment} from "../controllers/comment.controller.js"
import { verifyJwt } from '../middlewares/auth.middleware.js'

const router = Router()

router.route("/getallcomments/:videoId").get(getVideoComments)

export default router


