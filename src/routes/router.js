import {Router} from 'express' // yha Router bracket ke andar isliye likha kyunki express ke andar Router ek named export hai
import { loginUser, registerUser, logoutUser } from "../controllers/user.controller.js"
import upload from "../middlewares/multer.middleware.js"
import { verifyJwt } from '../middlewares/auth.middleware.js'
const router = Router()

router.route("/register").post(
    upload.fields([
        {
           name:"avatar",maxCount:1
        },
        {
           name:"coverImage",maxCount:1
        }
    ]),registerUser)//hm registerUser method execute  krne se pehle middleware lga rhe h 
router.route("/login").post(loginUser)

router.route("/logout").post(verifyJwt,logoutUser)//yha hmne middleware yhi inject kr dia method se pehle. aur bhi middleware ho to unhr=e commma lgakar likh do
export default router










