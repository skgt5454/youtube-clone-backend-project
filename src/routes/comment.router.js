import {Router} from 'express'
import {getVideoComments,addComment, updateComment,deleteComment} from "../controllers/comment.controller.js"
import { verifyJwt } from '../middlewares/auth.middleware.js'

const router = Router()

router.route("/getallcomments/:videoId").get(getVideoComments)

router.route("/addcomments/:videoId").post(verifyJwt,addComment)

router.route("/updatethecomments/:commentId").patch(verifyJwt,updateComment)

router.route("/deletecomments/:commentId").delete(verifyJwt,deleteComment)

export default router


