import mongoose, {isValidObjectId} from "mongoose"
import {PlayList} from "../models/playlists.model.js"
import {ApiError} from "../utils/apiError.js"
import {apiresponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {User} from "../models/user.model.js"
import { Video } from "../models/video.model.js"
const createPlaylist = asyncHandler(async (req, res) =>{
    const {name, description} = req.body
    if(!name || !description)
    {
        throw new ApiError(400,"name or description are not uploaded")
    }
    const playlist = await PlayList.create(
    {
       name:name,
       description:description,
       owner:req.user._id,
    })
   if(!playlist)
    {
    throw new ApiError(400,"playlist is not created")
   }
   return res.status(201).json(new apiresponse(201,playlist,"playlist creation successfull"))
}
)
const getUserPlaylists = asyncHandler(async (req, res) => {

    const {userId} = req.params

    const user = await User.findById(userId)

    if(!user)
    {
        throw new ApiError(404,"user is not defined to get user playlist")
    }
    
    const playlist = await PlayList.find({owner:userId}) // ek user ki multiple playlist ho skti hai to find matching playlists ka array return krega

    if(playlist.length==0)
    {
        return res.status(200).json(new apiresponse(200,[],"users playlist is empty"))
    }
    return res.status(200).json(new apiresponse(200,playlist,"playlist found successfully"))
})
const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

    if(!playlistId)
    {
        throw new ApiError(400,"playlist id is not available");
    }

    const playlist = await PlayList.findById(playlistId);

    if(playlist)
    {
        throw new ApiError(404, "Playlist not found");
    }
    return res.status(200).json(new apiresponse(200,playlist,"playlist is accessed"))
    
})
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!playlistId || !videoId)
    {
        throw new ApiError(400,"complete info. were not available");
    }

    const video = await Video.findById(videoId)

    if(!video)
    {
        throw new ApiError(400,"video to add in playlist is not found")
    }
    
    const playlistupdate = await PlayList.findByIdAndUpdate(playlistId,
        {
            $addToSet:
            {
                videos:video._id
            }
        },
        {
            new:true
        }
    )

      if(!playlistupdate){throw new ApiError(400,"playlist is not update")}

    return res.status(200).json(new apiresponse(200,playlistupdate,"playlist is updated"))
})
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if (!mongoose.isValidObjectId(playlistId) ||
    !mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid playlistId or videoId");
}

    const video = await Video.findById(videoId)

    if(!video)
    {
        throw new ApiError(400,"video to add in playlist is not found")
    }
//agr playlist se koi video delete krni h to pull operator use krenge
    const playlistupdate = await PlayList.findByIdAndUpdate({_id:playlistId,owner:req.user._id},
        {
            $pull:
            {
                videos:video._id
            }
        },
        {
            new:true
        }
    )
      if(!playlistupdate){throw new ApiError(400,"playlist is not update")}

    return res.status(200).json(new apiresponse(200,playlistupdate,"playlist is updated"))

})
const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if(!mongoose.isValidObjectId(playlistId))
    {
        throw new ApiError(400,"send the authenticate playlistId")
    }

    const playlist = await PlayList.findByIdAndDelete(playlistId)

    return res.status(200).json(new apiresponse(200,playlist,"playlist is successfully deleted"))
})
const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
}
   if (name === undefined && description === undefined) {
    throw new ApiError(400, "At least one field is required");
}
const updateFields = {};
    if (name !== undefined) {
    updateFields.name = name;
}

if (description !== undefined) {
    updateFields.description = description;
}

    const updateplaylist = await PlayList.findByIdAndUpdate({_id:playlistId,owner:req.user._id},
        {
        $set: updateFields
    },
    {
        new:true,
        runValidators:true
    }
)
if(!updateplaylist){throw new ApiError(400,"playlist is not updated")}

return res.status(200).json(new apiresponse(200,updateplaylist,"playlist is updated"))
})
export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
//agr playlist mil aur usme 2 playlist hui to
//[
//     { name: "Java DSA", owner: "12345" },
//     { name: "Web Development", owner: "12345" }
// ]
//playlist.length == 0 iska means playlist arrya me 0 elemnents hainn