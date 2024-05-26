import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET, 
});


export const uploadImage = async (image, folder) => {
    const uploadedImage = await cloudinary.uploader.upload(image.tempFilePath, { folder: folder, unique_filename: true });
    return uploadedImage;
}

export const deleteImage = async (imageIdentifier) => {
    const deletedImage = await cloudinary.uploader.destroy(imageIdentifier);
    console.log(deletedImage);
};
