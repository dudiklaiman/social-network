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
        if (compressedImage.size > 10000000) throw new Error(`image too large: ${(compressedImage.size / 1024 / 1024).toFixed(2)} MB (Max: ${options.maxSizeMB} MB)`);
        return compressedImage;
    } 
    catch (error) {
        throw error;
    }
}


export const formatTimePassed = (date, isSmallScreen=false) => {
    let result = formatDistanceToNow(date, { addSuffix: true }).replace("about", "").replace("less than a minute ago", "Right now");

    if (isSmallScreen) {
        if (result === "Right now") return result.replace("Right now", "Now");

        const units = {
            minutes: 'm',
            hours: 'h',
            days: 'd',
            weeks: 'w',
            months: 'M',
            years: 'y'
        }

        const unitsSingular = {
            minute: 'm',
            hour: 'h',
            day: 'd',
            week: 'w',
            month: 'M',
            year: 'y'
        }

        for (const [key, value] of Object.entries(units)) {
            result = result.replace(` ${key} ago`, value);
        }

        for (const [key, value] of Object.entries(unitsSingular)) {
            result = result.replace(` ${key} ago`, value);
        }

        result = result.replace("ago", "");
    }

    return result;
}


export const formatDateToMonthAndYear = (date) => {
    const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
};
