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

    async findAll(req: Request, res: Response) {
        try {
            const {page = 1, limit = 8} = req.query as {page: string; limit: string};
            
            const result = await ActivityModel.find({}).limit(+limit).skip((+page - 1) * +limit).sort({createdAt: -1}).exec();

            const total = await ActivityModel.countDocuments();
            response.pagination(res, result, {current: +page, total: +total, totalPage: Math.ceil(+total / +limit)}, "success to find all activity");
        }catch(error) {
            response.error(res, error, "failed to find all activity");
        }
    },

    async findById(req: Request, res: Response) {
        try {
            const {id} = req.params;

            if(!isValidObjectId(id)) return response.notFound(res, "activity is not found");

            const result = await ActivityModel.findById(id);

            if(!result) return response.notFound(res, "activity is not found");

            response.success(res, result, "success to find one activity");
        } catch(error) {
            response.error(res, error, "failed to find one activity");
        }
    },

    async update(req: IReqUser, res: Response) {
        try {
            const {id} = req.params;

            if(!isValidObjectId(id)) return response.notFound(res, "activity is not found");

            const result = await ActivityModel.findByIdAndUpdate(id, {...req.body});

            response.success(res, result, "success to update activity");
        } catch(error) {
            response.error(res, error, "failed to update activity");
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