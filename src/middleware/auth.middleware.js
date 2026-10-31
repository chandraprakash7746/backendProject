// yea sirf request send krne bale user ki identity verify krega

import { User } from "../models/users.model.js";
import { AppError } from "../utility/AppError.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, res, next) => {

  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace(/^Bearer\s+/i, "");

  if (!token) {
    throw new AppError("Unauthorized request", 401);
  }

  const decodedToken = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET
  );

  console.log("Decoded Token:", decodedToken);

  const user = await User.findById(decodedToken?.id)
    .select("-password -refreshToken");

    // console.log("Decoded user ID:", decodedToken?.id);
    // console.log("User from database:", user);

  if (!user) {
    throw new AppError("Invalid Access Token", 401);
  }

  req.user = user;

  next();
});