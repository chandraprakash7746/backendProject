import { asyncHandler } from "../utility/asyncHandler.js";
import { AppError } from "../utility/AppError.js";
import { User } from "../models/users.model.js";
import { uploadResult } from "../service/cloudinaryFileUpload.js";
import { ApiResponse } from "../utility/ApiResponse.js";


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


  // Check user already exist or not
  const isUserExist = User.findOne({
    $or: [{username}, {email}]
  })
  if(isUserExist){
    throw new AppError("User with email or username already exist", 409)
  }

  //   Check images and avtar
  const avtaarLocalPath = req.files?.avatar[0]?.path;

  const coverImageLocalPath = req.files?.coverImage[0]?.path;

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

    const createdUser = await User.findById(user._id).select("-password -refereshToken")

    if(!createdUser){
        throw new AppError("Something went wrong while registring the user.", 500)
    }

    // return api response
    return res.status(200).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )


});

export { registerUser };
