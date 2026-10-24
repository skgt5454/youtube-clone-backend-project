import {Router} from "express"
import { toggleSubscription,getUserChannelSubscribers,getSubscribedChannels } from "../controllers/subscription.controller.js"

const router = Router()

router.route("/toggleSubscription/:channelId").post(toggleSubscription)
router.route("/getUserChannelSubscribers/:channelId").get(getUserChannelSubscribers)
router.route("/getSubscribedChannels/:userId").get(getSubscribedChannels)

export default router

