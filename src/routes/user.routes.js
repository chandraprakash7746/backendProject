import { Router } from "express";
import { chnageCurrentPassword, getCurrentUser, getUserChannelProfile, login, logout, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const userRouter = Router();

// Ha to ab hume btate hai ki ydi koi user /users rout pr aata he to use kya kaam krna hai
userRouter.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
// userRouter.route means userRouter me tumhe ek rout btata hun

// above line ko me kuch is trhe se bhi likh skta hun
// userRouter.post("/register", signup) as good as userRouter.route("/register").post(registerUser);

userRouter.route("/login").post(login);
userRouter.route("/logout").post(verifyJWT, logout);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/change-current-password").post(verifyJWT, chnageCurrentPassword)
userRouter.route("/current-user").get(verifyJWT, getCurrentUser);
userRouter.route("/c/:username").get(verifyJWT, getUserChannelProfile);


export default userRouter;
