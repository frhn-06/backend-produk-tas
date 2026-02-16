import ActivityModel, { activityDTO } from "../models/activity.model";
import { IReqUser } from "../utils/interface";
import { Request, Response } from "express";
import response from "../utils/response";
import { isValidObjectId } from "mongoose";
import ProductModel from "../models/product.model";

const activityController = {
    async create(req: IReqUser, res: Response) {
        try {
            const validate = await activityDTO.validate(req.body);

            const result = await ActivityModel.create(validate);

            response.success(res, result, "success to create activity");
        }catch(error) {
            response.error(res, error, "failed to create activity");
        }
    },

    async delete(req: IReqUser, res: Response) {
        try {
            const {id} = req.params;

            if(!isValidObjectId(id)) return response.notFound(res, "activity is not found");

            const result = await ActivityModel.findByIdAndDelete(id);

            await ProductModel.updateMany(
                { activities: id },
                { $pull: { activities: id } }
            );

            response.success(res, result, "success to delete activity")
        }catch(error) {
            response.error(res, error, "failed to delete activity");
        }
    },
}

export default activityController;