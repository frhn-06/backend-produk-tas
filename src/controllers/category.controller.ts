import CategoryModel, { categoryDTO, ICategoryForm } from "../models/category.model";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import { Response } from "express";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await categoryDTO.validate(req.body);

            const result = await CategoryModel.create(req.body);

            response.success(res, result, "success to create category");
            
        }catch(error) {
            response.error(res, error, "failed to create category");
        }
    },

    async findAll(req: IReqUser, res: Response) {
        const {page = 1, limit = 8, search} = req.query as {page: string | number, limit: string | number, search: string};
        
        try {
            
            const BuidQuery = (search: string) => {
                let queryAwal: FilterQuery<ICategoryForm> = {};

                if(search) queryAwal.$text = {$search: search}

                return queryAwal;
            }
    
            const query = BuidQuery(search)
            
            const result = await CategoryModel.find(query).limit(+limit).skip((+page - 1)* +limit).sort({createdAt: 1}).exec();

            const total = await CategoryModel.countDocuments(query);

            response.pagination(res, result, {current: +page, totalPage: Math.ceil(+total / +limit), total: +total}, "success to find all categories");

        }catch(error) {
            response.error(res, error, "failed to find all categories");
        }
    },

    async findOne(req: IReqUser, res: Response) {
        const {id} = req.params;
        
        try {
            if(!isValidObjectId(id)) response.notFound(res, "category is not found");

            const result = await CategoryModel.findById(id);

            if(!result) response.notFound(res, "category is not found");

            response.success(res, result, "success to find a category");
        } catch(error) {
            response.error(res, error, "failed to find all categories");
        }
    },

    async update(req: IReqUser, res: Response) {
        const {id} = req.params;

        try {
            if(!isValidObjectId(id)) response.notFound(res, "category not found")

            const result = await CategoryModel.findByIdAndUpdate(id, req.body, {new: true});

            if(!result) response.notFound(res, "category is not found");

            response.success(res, result, "success to update category");

        }catch(error) {
            response.error(res, error, "failed to update category");
        }
    },

    async remove(req: IReqUser, res:Response) {
        const {id} = req.params;

        try {
            if(!isValidObjectId(id)) response.notFound(res, "category not found")

            const result = await CategoryModel.findByIdAndDelete(id);

            if(!result) response.notFound(res, "category is not found");

            response.success(res, result, "success to remove category");

        } catch(error) {
            response.error(res, error, "failed to remove category");
        }
    }
}