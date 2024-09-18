const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
      Promise.resolve(requestHandler(req, res, next)) // Correct 'Promise' capitalization
        .catch((err) => {
          next(err); // Forward the error to Express error handling
        });
    };
  };
  
  export { asyncHandler };
  



//  this one for try and catch method for asynchandler
// const asyncHandler=(fn)=>async(req,res,next,err)=>{
// try{
//     await fn(req,res,next)

// }
// catch(error){
//     res.status(err.code || 500).json({
//         message:err.message,
//         success:false
//     }))

// }

// }