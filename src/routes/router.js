import {Router} from 'express' // yha Router bracket ke andar isliye likha kyunki express ke andar Router ek named export hai
import { registerUser } from "../controllers/user.controller.js"
import upload from "../middlewares/multer.middleware.js"

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
    
export default router










