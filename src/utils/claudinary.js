
import fs from "fs"
import { v2 as cloudinary } from 'cloudinary';

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    const uploadOnCloudinary= async(localFilepath)=>{

        try{
            if(!localFilepath)
                return null
            const response= await cloudinary.uploader.upload(localFilepath, {
                resource_type:"auto"
              })
            //   console.log("file has been uploaded on cloudinary",response.url);
            //   return response;
            fs.unlinkSync(localFilepath)
            return response
        }
        catch(error){
            fs.unlinkSync(localFilepath)
            return null; 
        }
    }
    export {uploadOnCloudinary}