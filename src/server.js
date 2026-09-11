import connectDB from "./db/index.js"
import {app} from "./app.js"

connectDB().then(
    ()=>{app.listen(process.env.PORT || 2000,()=>{console.log(`server is running on : ${process.env.PORT||2000}`)})
    
    app.on("error",(error)=>{console.log(`the error is occured:${error}`)})}
).catch((err)=>{console.log("error :", err)})





























// import dotenv from "dotenv"
// import mongoose from "mongoose"
// import {DB_NAME} from "./constants.js"
// import express from "express"
// const app = express()
// (async()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("errror",(error)=>{console.log("err : ",error)
//             throw error;
//         })
//         app.listen(process.env.PORT, ()=>{console.log(`app is listening on ${process.env.PORT}`)})
//     }
//     catch(error)
//     {
//         console.log("err:",error)
//         throw error
//     }
// })()


