import { asyncHandler } from "../utility/asyncHandler.js";
import { AppError } from "../utility/AppError.js";
import { User } from "../models/users.model.js";
import { uploadResult } from "../service/cloudinaryFileUpload.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken = async (user) => {
  // console.log("User in generateAccessAndRefreshToken ", user)
  try {
    
    const accessToken = await user.generateAccessToken();
    
    const refreshToken = await user.generateRefreshToken();
    
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave : false})

    return {accessToken, refreshToken}
  } catch (error) {
    console.error("TOKEN GENERATION ERROR:", error);
    throw new AppError("Something went wrong while generating access and refresh Token", 500)
  }
}

const registerUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body;

  // fullname validation
  // if(fullname === ""){
  //     throw new AppError("Full name can not empty", 400);
  // }

  // One more interestiing way to check each field is empty or not. is method se hme khud se bar bar if() nhi lgane pdege.
  if (
    [username, fullname, email, password].some((field) => field?.trim() === "") // It means koi bhi field trim hone ke baad bhi koi ek bhi field "" hoti he to yea true return krega and hum us case me error throw kr dege.
  ) {
    throw new AppError("Full name can not empty", 400);
  }


  // Check user already exist or not. It return null if user not found otherwise return {}
  const isUserExist = await User.findOne(
    { $or: [ { username }, { email } ] }
  )


  if(isUserExist){
    throw new AppError("User with email or username already exist", 409)
  }

  //   Check images and avtar
  const avtaarLocalPath = req.files?.avatar[0]?.path;

  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path;
  }


  if(!avtaarLocalPath){
    throw new AppError("Avtar is required", 400)
  }


  // Upload avtar and coverImages on cloudinaary
  const avatar = await uploadResult(avtaarLocalPath);

  const coverImage = await uploadResult(coverImageLocalPath);

  // ek baar check kro ki avtaar cloudinary pr gya he ya nahi. Avtar required field hai ydi yea nahi gya to backend ki bc ho jayegi
  if(!avatar){
    throw new AppError("Avtar is required", 400)
  }

//   Create an object and uski entry db me krado
    const user = await User.create({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage?.url || "", //isme or operator ka use isliyea kiya keuki ise hmne uper alg se valid nahi kiya tha keuki schema me yea required nahi hai
        email,
        password,
        username : username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new AppError("Something went wrong while registring the user.", 500)
    }

    // return api response
    return res.status(200).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )


});

const login = asyncHandler(async (req,res) => {
  // Get user info
  const {username, email, password} = req.body;


  // check username and email are provided or not
  if(!username && !email){
    throw new AppError("Please provide email or username", 400);
  }

  // check user exist or not basis of username or email and it return userObj
  const existedUser = await User.findOne({
    $or : [{username}, {email}]
  })

  console.log("value of existedUser ",existedUser)
  if(!existedUser){
    throw new AppError("User not found",404);
  }

  const userPassword = await existedUser.comparePassword(password);

  console.log("userPassword ",userPassword); // true or false
  if(!userPassword){
    throw new AppError("Password incorrect",401);
  }

  // Generate Access and Refresh tocken
  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(existedUser);
  
 console.log("Access Token in login controller function ",accessToken)
 console.log("Refresh Token in login controller function ",refreshToken)
 // Fetch the logged-in user's latest details from the database, excluding sensitive fields like password and refreshToken before sending the user data in the API response.
 //  Kyunki login ke beech mein humne user ka refreshToken database mein update kiya tha:
  const loggedInUser = await User.findById(existedUser.id)
  .select("-password -refreshToken");

  // Deside user ko kon kon c information send krni hai
  // cookie by-default frontend pr koi bhi modify kr skta hai but httpOnly true and secure true se ab ye sirf server pr hi modify ho skti hai.
  const options = {
    httpOnly : true,
    secure : true
  } 

  // Return response
  res.status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken",refreshToken).json(
    new ApiResponse(200,
      {
        user : loggedInUser, accessToken, refreshToken
      },
      "User logged in successfully"
    )
  )

})

const logout = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

// refresh, access token endPoint
const refreshAccessToken = asyncHandler( async (req, res) => {
  console.log("Hello from refreshAccessToken");
  // get refreshToken
  const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if(!incommingRefreshToken){
    throw new AppError(401,"Unauthorized request")
  }

  // Verify refresh token
  const decodedToken =  jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

  // Find user by tocken's paylod
  // console.log("Decoded token ",decodedToken)
  const user = await User.findById(decodedToken.id);
  if(!user){
    throw new AppError("Invalid refresh token", 401);
  }

  // Compare DB token and incommingRefreshToken
  if(incommingRefreshToken !== user.refreshToken){
    throw new AppError("Refresh token mismatch", 402)
  }

  // Generate new tokens
  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user);

  // Send new Tokens in res
  const options = {
    httpOnly : true,
    secure : true
  }

  return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
              success : true,
              message : "Access token refreshed successfully"
            });

});



export { 
  registerUser,
  login,
  logout,
  refreshAccessToken,
 };


 