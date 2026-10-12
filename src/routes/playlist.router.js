import {Router} from "express"
import {createPlaylist,getUserPlaylists,getPlaylistById,addVideoToPlaylist,removeVideoFromPlaylist,deletePlaylist,updatePlaylist} from "../controllers/playlist.controller.js"
import {verifyJwt} from "../middlewares/auth.middleware.js"
const router = Router()
router.route("/createplaylist").post(
    verifyJwt,
    createPlaylist
);
router.route("/getplaylist/:userId").post(getUserPlaylists)

router.route("/getplaylistbyid/:playlistId").post(getPlaylistById)

router.route("/addvideos/:videoId/:playlistId").patch(addVideoToPlaylist)

router.route("/removevidefromplaylist/:videoId/:playlistid").patch(verifyJwt,removeVideoFromPlaylist)

router.route("/deleteplaylist/:playlisId").patch(verifyJwt,deletePlaylist)

router.route("/updatetheplaylist/:playlistId").patch(verifyJwt,updatePlaylist)

export default router









