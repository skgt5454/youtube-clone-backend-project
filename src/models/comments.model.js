import mongoose,{Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2" // ye isliye use krte h taake pura content ek sath na aaye thora thora load hokr aata rhe
const commentSchema = new mongoose.Schema({
   content:{
    type:String,
    require:true
   },
   video:{
    type:Schema.Types.ObjectId,
    ref:"Video"
   },
   owner:
   {
    type:Schema.Types.ObjectId,
    ref:"User"
   }
},
{
    timestamps:true
})
commentSchema.plugin(mongooseAggregatePaginate) // ye bss ability deta hai h ki kha se kha tk video dene ya comment dena hai

export const Comment = mongoose.model("Comment",commentSchema)