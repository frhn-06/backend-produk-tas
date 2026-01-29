import multer from "multer";


const upload = multer({
    storage: multer.memoryStorage()
});

export default {
    single(fieldName: string) {
        return upload.single(fieldName);
    },
    multiple(fieldName: string) {
        return upload.array(fieldName);
    }
}