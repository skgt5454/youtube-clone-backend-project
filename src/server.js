import connectDB from "./db/index.js"

connectDB()

























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


