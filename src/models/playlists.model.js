import mongoose,{Schema} from "mongoose"
const playlistSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    videos:[ // idhar kafi sarevideos aayege to vo array me store hoti hai
        {
           type:Schema.Types.ObjectId,
           ref:"Video"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
   comment:{
    type:Schema.Types.ObjectId,
    ref:"Comment"
   },
   tweet:{
    type:Schema.Types.ObjectId,
    ref:"Tweet"
   },
   likedBy:{
    type:Schema.Types.ObjectId,
    ref:"User"
   }

},
{
    timestamps:true
})
export const PlayList = mongoose.model("PlayList",playlistSchema)