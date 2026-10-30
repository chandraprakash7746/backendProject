import mongoose, { Schema } from "mongoose";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      minlength: [3, "Username atlest contain 3 characters"],
      maxlength: [20, "username can not be more than 20 characters."],
      required: true,
      index: true, // kisi bhi field ko searchable banan hai optimized tarike se, to index true kr do
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      trim: true, // Removes leading/trailing whitespaces
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Passward is required"],
    },
    watchHistory: [
      {
      type: Schema.Types.ObjectId,
      ref: "Video",
      }
   ],
    avatar: {
      type: String, // cloudenary URL string aayegi
      required: true,
    },
    coverImage: {
      type: String,
    },
    refreshToken: {
      type : String
    },
  },
  { timestamps: true }
);

// password ko kya hum normal string me hi rakhege
// So we install bcrypt package for password - It is a liberary, help you hash passwords.
// What is refereshToken?
// Tocken ke liyea hum JSONwebtocken package install krege -

// Password ko database mein save karne se pehle hash karne ke liye pre-save hook banaya hai.
userSchema.pre("save", async function () {
  // Check karta hai ki password naya hai ya change hua hai.
  // "password" string hai, jo schema ke password field ka naam hai.
  // Agar password change nahi hua, toh dobara hash karne ki zaroorat nahi.
  if (!this.isModified("password")) return;

  // Password ko hash karke save karne ke liye.
  this.password = await bcrypt.hash(this.password, 10);
});

// Login ke time user ke entered password ko stored hashed password se compare karne ke liye method banaya hai.
userSchema.methods.comparePassword = async function (candidatePassword) {
  // Match hone par true, nahi hone par false return karta hai.
  return await bcrypt.compare(candidatePassword, this.password);
};

// Token generate method

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    // payload
    {
      id: this._id,
      username: this.username,
      fullname: this.fullname,
    },
    // secret
    process.env.ACCESS_TOKEN_SECRET,
    // options
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    // payload
    {
      id: this._id,
    },
    // secret
    process.env.REFRESH_TOKEN_SECRET,
    // options
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    }
  );
}

export const User = mongoose.model("User", userSchema);
