import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()
app.get("/",(req,res)=>{
res.send("hiteshsir")
})
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
export {app}
