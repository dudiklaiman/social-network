import imageCompression from 'browser-image-compression';
import { formatDistanceToNow } from "date-fns";


export const compressImage = async (image) => {
    const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    }

    try {
        const compressedImage = await imageCompression(image, options);
        if (compressedImage.size > 10000000) return console.log(`image too large: (${compressedImage.size / 1024 / 1024} MB)`);
        return compressedImage;
    } 
    catch (error) {
        console.log(error);
    }
}


export const formatTimePassed = (date) => {
    return formatDistanceToNow(date, { addSuffix: true }).replace("about", "");
}


export const formatDataToMonthAndYear = (date) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
};