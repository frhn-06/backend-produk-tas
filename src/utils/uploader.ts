import {v2 as cloudinary} from 'cloudinary'
import { API_KEY, API_SECRET, CLOUD_NAME } from './env';



cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
})


const toUrl = (file: Express.Multer.File) => {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const fileUrl = `data:${file.mimetype};base64,${b64}`;
    return fileUrl;
}

const getpublicId = (url: string) => {
    const pathName = url.substring(url.lastIndexOf("/") + 1);
    const publicId = pathName.substring(0, pathName.lastIndexOf('.'));
    return publicId;
}


export default {
    async uploadSingle(file: Express.Multer.File) {
        const fileUrl = toUrl(file);
        const result = await cloudinary.uploader.upload(fileUrl, {
            resource_type: "auto"
        });
        return result;
            
    },

    async uploadMultiple(files: Express.Multer.File[]) {
        const uploadMipil = files.map((file) => {
            const result = this.uploadSingle(file);
            return result;
        });
        const result = await Promise.all(uploadMipil);
        return result;
    },

    async remove(url: string) {
        const publicId = getpublicId(url);
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    }
}