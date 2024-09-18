import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/claudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"



const generateAccessAndRefreshTokens=async(userId)=>{
    try{
       const user = await User.findById(userId)
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()
       user.refreshToken=refreshToken
       await user.save({validateBeforeSave:false})
       return {accessToken,refreshToken}
    }
    catch(error){
        throw new ApiError(400,"something went wrong")
    }
}


const registerUser =asyncHandler(async (req,res)=>{
    //get user details from frontend 
    // validation - not empty
    // check if user already exists :username ,email
    //check for images ,check for avatar
    // upload them to cloudinary ,avatar 
    // create user object -crete entry in db 
    // remove password and refresh token field from response 
    // check for user creation 
    // send response back to frontend 
    const{fullName,email,username,password}=req.body;
    // console.log("email:",email);

        if ([fullName,email,username,password].some((field)=>
        field?.trim()==="")){
            throw new ApiError(400,"allfields are required")
        }

     const existedUser=await User.findOne({
            $or:[{username},{email}]
        })
    
        if(existedUser){
            throw new ApiError(409,"username or email already exists")
        }
        //  console.log(req.files);
    
        const avatarLocalPath=req.files?.avatar[0]?.path

        // const coverImageLocalPath=req.files?.coverImage[0]?.path;
        let coverImageLocalPath;
        if(req.files&& Array.isArray(req.files.coverImage)&&req.files.coverImage.length>0){
            coverImageLocalPath=req.files.coverImage[0].path
        }


        if(!avatarLocalPath)
            {
                throw new ApiError(400,"avatar is required")

            }
            

        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)

        if(!avatar){
            throw new ApiError(400,"avatar is required")

        }

        const user = await User.create({
            fullName,
            username:username.toLowerCase(),
            email,
            password,
            avatar:avatar.url,
            coverImage:coverImage?.url || "",
         })
         const createdUser=await User.findById(user._id).select(
            "-password -refreshToken"
         )
         if(!createdUser){
            throw new ApiError(500,"something went wrong while registering")
         }
         return res.status(201).json(
            new ApiResponse(200,createdUser,"registered successfully")
         )
})

const loginUser = asyncHandler(async(req,res)=>{
// todos 
// insert email /user and password 
// check if user exists
// check if pasword 
//if coorect return token 
//send cookies
//send token in response body
// if not return error
// if user doesnot exist send message user has not registered
const {email,username,password}=req.body
if(!username || !email){
    throw new ApiError(400,"username or email are required")
}
const user= await User.findOne({
    $or:[{email},{username}]
})
if(!user){
    throw new ApiError(400,"user has not registered")
}

const isPasswordValid = await user.isPasswordCorrect(password)
if(!isPasswordValid){
    throw new ApiError(400,"password is incorrect")
}
const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)

const loggedInUser = await User.findById(user._id).select("-password -refreshToken" )

const cookiesOptions = {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: true,

}
return res
.status(200)
.cookie("accessToken",accessToken,cookiesOptions)
.cookie("refreshToken",refreshToken,cookiesOptions
    .json(
        new ApiResponse(200,loggedInUser,"logged in successfully")
    )
)

})
const logoutUser = asyncHandler(async(req,res)=>{
await User.findByIdAndUpdate(
    req.user._id,
    {
        $set:{
            refreshToken:undefined,
            
        }
    }
    ,{
        new:true
    })

    const cookiesOptions = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken",cookiesOptions)
    .clearCookie("refreshToken",cookiesOptions)
    .json(new ApiResponse(200,{},"logout successfully"))
})



export {registerUser}
export {loginUser}
export {logoutUser}