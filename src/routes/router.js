import {Router} from 'express' // yha Router bracket ke andar isliye likha kyunki express ke andar Router ek named export hai
import {registerUser,loginUser,logoutUser,refreshAccessToken,updateAccountDetails,getcurrentUser,changeCurrentPassword,updateUserAvatar,oldAvatarDeleted,updateUserCoverImage,getUserChannelProfile,getWatchHistory} from "../controllers/user.controller.js"
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

router.route("/refreshToken").post(refreshAccessToken)

router.route("/change-password").post(verifyJwt,changeCurrentPassword)

router.route("/current-user").get(verifyJwt,getcurrentUser)

router.route("/update-account-details").patch(verifyJwt,updateAccountDetails)

router.route("/update-avatar").patch(verifyJwt,upload.single("avatar"),updateUserAvatar)

router.route("/update-cover-image").patch(verifyJwt,upload.single("coverImage"),updateUserCoverImage)

router.route("/delete-old-avatar").delete(verifyJwt,oldAvatarDeleted)

router.route("/get-user-channel-profile/:userId").get(verifyJwt,getUserChannelProfile)

router.route("/get-watch-history").get(verifyJwt,getWatchHistory)

export default router










