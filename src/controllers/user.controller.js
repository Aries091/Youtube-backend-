import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/claudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"



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
    const{fullName ,email,username,password}=req.body;
    console.log("email:",email);

        if ([fullName,email,username,password].some((field)=>
        field?.trim()==="")){
            throw new ApiError(400,"allfields are required")
        }

     const existedUser=User.findOne({
            $or:[{username},{email}]
        })
    
        if(existedUser){
            throw new ApiError(409,"username or email already exists")
        }
    
        const avatarLocalPath=req.files?.avatar[0]?.path

        const coverImageLocalPath=req.files?.coverImage[0]?.path;

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
         if(createdUser){
            throw new ApiError(500,"something went wrong while registering")
         }
         return res.status(201).json(
            new ApiResponse(200,createdUser,"registered successfully")
         )
})

export {registerUser}
