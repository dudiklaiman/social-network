import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET, 
});


export const uploadImage = async (image) => {
    const uploadedImage = await cloudinary.uploader.upload(image.tempFilePath, { unique_filename: true });
    return uploadedImage.secure_url;
}

export const deleteImage = async () => {
    // console.log(cloudinary.utils.publicId("https://res.cloudinary.com/dtk7xoyb4/image/upload/v1704813749/iy0tz6tjtskev2hpmwui.jpg"));
};
