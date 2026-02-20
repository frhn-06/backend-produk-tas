import BannerModel, { bannerDTO, IBannerForm } from "../models/banner.model";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import { Response } from "express";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
    async create(req: IReqUser, res: Response) {
        try {
            await bannerDTO.validate(req.body);

            const result = await BannerModel.create(req.body);

            response.success(res, result, "success to create banner");
            
        }catch(error) {
            response.error(res, error, "failed to create banner");
        }
    },

    async findAll(req: IReqUser, res: Response) {
        const {page = 1, limit = 8, search} = req.query as {page: string | number, limit: string | number, search: string};
        
        try {
            
            const BuidQuery = (search: string) => {
                let queryAwal: FilterQuery<IBannerForm> = {};

                if(search) queryAwal.$text = {$search: search}

                return queryAwal;
            }
    
            const query = BuidQuery(search)
            
            const result = await BannerModel.find(query).limit(+limit).skip((+page - 1)* +limit).sort({createdAt: -1}).exec();

            const total = await BannerModel.countDocuments(query);

            response.pagination(res, result, {current: +page, totalPage: Math.ceil(+total / +limit), total: +total}, "success to find all banners");

        }catch(error) {
            response.error(res, error, "failed to find all banners");
        }
    },

    async findOne(req: IReqUser, res: Response) {
        const {id} = req.params;
        
        try {
            if(!isValidObjectId(id)) response.notFound(res, "banner is not found");

            const result = await BannerModel.findById(id);

            if(!result) response.notFound(res, "banner is not found");

            response.success(res, result, "success to find a banner");
        } catch(error) {
            response.error(res, error, "failed to find all categories");
        }
    },

    async update(req: IReqUser, res: Response) {
        const {id} = req.params;

        try {
            if(!isValidObjectId(id)) response.notFound(res, "banner not found")

            const result = await BannerModel.findByIdAndUpdate(id, req.body, {new: true});

            if(!result) response.notFound(res, "banner is not found");

            response.success(res, result, "success to update banner");

        }catch(error) {
            response.error(res, error, "failed to update banner");
        }
    },

    async remove(req: IReqUser, res:Response) {
        const {id} = req.params;

        try {
            if(!isValidObjectId(id)) response.notFound(res, "banner not found")

            const result = await BannerModel.findByIdAndDelete(id);

            if(!result) response.notFound(res, "banner is not found");

            response.success(res, result, "success to remove banner");

        } catch(error) {
            response.error(res, error, "failed to remove banner");
        }
    }
}