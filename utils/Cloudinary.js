import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { ErrorResponse } from './ErrorHandler.js';
import dotenv from "dotenv"
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (localFilePath) => {
  try {
    
    if (!localFilePath) return null;
    console.log('here');
    
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // removed the locally saved temp filed as the upload operation got failed
    return null;
  }
};

const deleteOnCloudinary = async (cloudinaryFilePath) => {
  try {
    if (!cloudinaryFilePath)
      throw new ErrorResponse('cloudinary file path is missing', 400);

    const file = cloudinaryFilePath.split('/').pop().split('.')[0];
    const response = await cloudinary.uploader.destroy(file);

    return response;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    return null;
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };
