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

export default app;