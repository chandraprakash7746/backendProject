import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 8000;

const app = express();

// cookieParser configure
// Normal confugur
// app.use(cors());

// if you want to seetings in cors than you can Like -
app.use(cors({
  origin : process.env.CORS_ORIGIN
}))

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: '16kb'}));
app.use(express.static("public"));
app.use(cookieParser());

// step 1 import routes
import userRouter from "./routes/user.routes.js";

// step 2 Declare routes 
// router ko laane ke liyea middleware laana hota hai isliyea use() ka use kiya hai
app.use("/users", userRouter); // koi bhi user /users type krega tb aap userRouter pe control de doge

// step 3. go to user.route.js and and waha btana he ki ab kaam kya krna hai? to chalte hai dekhte hai

export default app;