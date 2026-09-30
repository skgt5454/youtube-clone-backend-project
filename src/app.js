import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.router.js"
import videoRouter from "./routes/video.router.js"
import playlistRouter from "./routes/playlistRouter.js"
import tweetRouter from "./routes/tweetRouter.js"
import likeRouter from "./routes/like.router.js"
import subscriptionRouter from "./routes/subscription.router.js"
import commentRouter from "./routes/comment.router.js"
const app = express()
// app.get("/",(req,res)=>{
// res.send("hiteshsir")
// })
app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
        credentials:true
    }
))
app.use(express.json({limit:"16kb"}))//Jab frontend/client JSON data backend ko bhejega
app.use(express.urlencoded({extended:true,limit:"16kb"}))//Jab data HTML form / URL-encoded format mein aaye.//yse middleware us data ko parse krke req.body me deta hai
app.use(cookieParser());//👉 Cookies read karne ke liye.
app.use(express.static("public"))//Jab tumhare paas public folder mein static files hain: images.jpg,style.css,etc.

// Routes
app.use("/api/v1/users", userRouter)// is path pr aane wali request ko userRouter ke pass bhejo
app.use("api/v1/videos",videoRouter)
app.use("api/v1/playlist",playlistRouter)
app.use("api/v1/likes",likeRouter)
app.use("api/v1/subscriptions",subscriptionRouter)
app.use("api/v1/tweet",tweetRouter)
app.use("api/v1/comment",commentRouter)



export {app}


