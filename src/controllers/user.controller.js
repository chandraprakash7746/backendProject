import { asyncHandler } from "../utility/asyncHandler.js";

const registerUser =  asyncHandler( async (req, res) => {
  console.log("Register user call")
  res.status(200).json({
    message : "ok"
  })
})

export {registerUser}