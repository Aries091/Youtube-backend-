


const asyncHandler = (requestHandler)=>{
    (req,res,next)=>{
        promise.resolve(requestHandler(req,res,next))
        .catch((err)=>{next(err)})
        
    }
}

export {asyncHandler}




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