// is service ko jb koi bhi use krega to yea mujhe file local (local file means - jo bhi file mere 
// server pr aa chuki hai) ka ek  path dega
// server se --> local path milega, and me use cloudinary pr daal duga.
// cloudinary pr upload hone ke baad hme server se us file ko delete bhi krna hoga

import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

 // Configuration
 // Cloudinary account ko configure karne ke liye,
// taaki hum images/videos upload kar sakein.
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    
    // Upload an image. It is a first way to upload
    //  const uploadResult = await cloudinary.uploader
    //    .upload(
    //        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
    //            public_id: 'shoes',
    //        }
    //    )
    //    .catch((error) => {
    //        console.log(error);
    //    });
    
    // console.log(uploadResult);
    
    // Second way and optimized way
    const uploadResult = async (localFilePath) => {
      try {
        if(!localFilePath) return "Could not find the path"

        //upload tthe file on cloudinary
       const response = await cloudinary.uploader.upload(localFilePath, {
          resource_type : 'auto'
        }) // upload ke ander kya kya fields de skte hai

        console.log("File is uploded on cloudinary")
        console.log("response url = ",response.url)
        fs.unlinkSync(localFilePath)
        return response;

      } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got fail
        return null;
      }
    }

    export {uploadResult}