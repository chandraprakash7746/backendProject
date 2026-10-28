// require('dotenv').config({path:'/.env'})
// import dotenv from "dotenv";
import "dotenv/config";
import connectDB from "./db/index.js";
import app from "./app.js";

// dotenv.config({
//   path: "./.env",
// });

const PORT = process.env.PORT|| 8080 ;
console.log("MY MONGO URI IS:", process.env.MONGODB_URI);
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error, applicatiion not able to talk to DB ", error);
      throw error;
    });

    app.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed !!");
  });






/*
// Approach 1

import mongoose from "mongoose";
import { DB_NAME } from "./constants";

import express from "express";
const app = express()

(async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        app.on("error", (error) => {
            console.log("Error, applicatiion not able to talk to DB ", error);
            throw error;
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listen on port ${process.env.PORT}`);
        })
    }catch(error){
        console.log("Error: ",error);
        throw error
    }
})()

// Step first => connect db
// Step sec. => initialize app using express

*/
