import { Response } from "express"
import { IReqUser } from "../utils/interface"
import response from "../utils/response"
import uploader from "../utils/uploader";

export default {
    async uploadSingle(req: IReqUser, res: Response) {
        if(!req.file) {
            return response.error(res, null, "file not exits");
        }

        try{
            const result = await uploader.uploadSingle(req.file as Express.Multer.File);

            response.success(res, result, "success to upload an image");
        } catch(error) {
            response.error(res, {
                name: error,
                message: error,
                stack: error,
                file: !!req.file,
                bodyKeys: Object.keys(req.body || {})
            }, "failed upload an image");
        }

    },

    async uploadMultiple(req: IReqUser, res: Response) {
        if(!req.files || req.files?.length === 0) {
            return response.error(res, null, "file not exits");
        }

        try{
            const result = await uploader.uploadMultiple(req.files as Express.Multer.File[]);
            response.success(res, result, "success to upload images");
        } catch(error) {
            response.error(res, error, "failed upload images");
        }
    },

    async remove(req: IReqUser, res: Response) {
        try {
            const {fileUrl} = req.body as {fileUrl: string};
            const result = await uploader.remove(fileUrl);
            response.success(res, result, "success to remove an image");
        } catch(error) {
            response.error(res, null, "failed to remove an image");
        }
    }
}