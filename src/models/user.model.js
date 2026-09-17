import mongoose,{Schema} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema = new Schema({
    username:
    {
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    fullname:
    {
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    email:
    {
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    avatar:
    {
        type:String,
        require:true
    },
    coverImage:
    {
        type:String,

    },
    password:
    {
        type:String,
        required:[true,"password is required"]
    },
    refreshToken:
    {
        type:String
    },
    watchHistory:
    [
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ]
},
{
    timestamps:true
})
userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next()
    this.password = await bcrypt.hash(this.password,10);
  // uha ab next ki zrurat nhi h kyunki yha async await lg rha h
})
userSchema.methods.ispasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken = async function()
{
    return jwt.sign(
        {
            _id:this._id,
            username:this.username,
            fullname:this.fullname,
            email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
           expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.generateRefreshToken = async function()
{
    return jwt.sign(
    {
    _id:this._id,
    },
   process.env.REFRESH_TOKEN_SECRET,
   {
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
   })
}
export const User = mongoose.model("User",userSchema)
