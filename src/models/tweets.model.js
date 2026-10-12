import mongoose,{Schema} from "mongoose"
const tweetSchema = new mongoose.Schema({
  content:{
    type:"String",
    required:true
  },
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },
  video:{
    type:Schema.Types.ObjectId,
    ref:"Video"
  }
},
{
    timestamps:true
})
export const Tweet = mongoose.model("Tweet",tweetSchema)



