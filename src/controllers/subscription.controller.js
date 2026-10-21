import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {apiresponse} from "../utils/apiResponse.js"
import {ApiError} from "../utils/apiError.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    
    const channelexists = await User.exists({_id: channelId})

    if(!channelexists)
    {
        throw new ApiError(404,"Channel not found")
    }

    const subscriptionexists = await Subscription.exists({channel: channelId, subscriber: req.user._id})

    if(!subscriptionexists)
    {
        const newSubscription = await Subscription.create({
        channel: channelId,
        subscriber: req.user._id
    })
    if(channelId === req.user._id)
    {
        throw new ApiError(400,"You cannot subscribe to your own channel")
    }
    if(!newSubscription)
    {
        throw new ApiError(400,"Failed to subscribe to the channel")
    }
    return res.status(200).json(new apiresponse(200,newSubscription,"Subscribed to the channel successfully"))
}

else
{
    const unsubscribed = await Subscription.findOneAndDelete({channel: channelId, subscriber: req.user._id})

    if(!unsubscribed)
    {
        throw new ApiError(400,"Failed to unsubscribe from the channel")
    }

    return res.status(200).json(new apiresponse(200,unsubscribed,"Unsubscribed from the channel successfully"))
}
})
// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    const channelexists = await User.exists({_id: channelId})
    if(!channelexists)
    {
        throw new ApiError(404,"Channel not found")
    }

    const subscriberscount = await Subscription.countDocuments({channel:channelId})

if(subscriberscount === 0)
{
    return res.status(200).json(new apiresponse(200,subscriberscount,"No subscribers found for this channel"))
}
return res.status(200).json(new apiresponse(200,subscriberscount,"Subscribers fetched successfully"))
})
// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { userId } = req.params

    const subscriberExists = await User.exists({ _id: userId });
    if (!subscriberExists) {
        throw new ApiError(404, "Subscriber not found");
    }

    const channelcount = await Subscription.countDocuments({ subscriber: userId });
    return res.status(200).json(new apiresponse(200,channelcount,"Subscribed channels fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}














