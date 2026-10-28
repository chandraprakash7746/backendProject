// Using Promise

const asyncHandler = (fn) => {
  return (req,res,next) => {
    Promise.resolve(()=> fn(req, res, next)).catch((error) => next(error))
  }
}



// Using try catch 
// const asyncHandler = (fn) => {
//   return async(req, res,next) => {
//     try {
//       await fn(req,res,next);
//     } catch (error) {
//       res.status(error.statusCode || 500).json({
//         success : false,
//         message : error.message
//       })
//     }
//   }
// }