import mongoose, { Schema } from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
  videoFile : {
    type : String, // cloudinary url
    required : [true, "Video file is required"],
  },

  thumbnail : {
    type : String, // cloudinary url
    required : true,
  },

  owner : {
    type : Schema.Types.ObjectId,
    ref : "User",
    required : true,
  },

  title : {
    type : String,
    required : true,
  },

  description : {
    type : String,
    required : true,
  },

  duration : {
    type : Number, // cloudinary se ayega
    required : true,
  },

  views : {
    type : Number,
    default : 0,
  },

  isPublished : {
    type : Boolean,
    default : true
  },
},{timestamps : true})


videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video", videoSchema)