import { IReqUser } from "../utils/interface";
import { Request, Response } from "express";
import response from "../utils/response";
import ReviewModel, { reviewDTO } from "../models/review.model";
import ProductModel from "../models/product.model";
import { FilterQuery, isValidObjectId } from "mongoose";

const  ReviewController = {
    async create(req: IReqUser, res: Response) {
        try {
            const validated = await reviewDTO.validate({...req.body, userId: req.user?.id});

            const result = await ReviewModel.create(validated);


            const product = await ProductModel.findById(req.body.productId);

            if(!product) return response.notFound(res, "product not found");

            const oldTotal = product.totalComment || 0;
            const oldAvg = product.starsAgr || 0;
            
            const newTotal: number = oldTotal + 1;
            const newAvg = ((oldAvg * oldTotal) + req.body.stars) / newTotal;

            product.totalComment = newTotal;
            product.starsAgr = Number(newAvg.toFixed(2));

            await product.save();


            response.success(res, result, "success to create rivew");

        } catch(error: any) {
        
            response.error(res, error, "failed to create review");
        }
    },
    
    async findByProduct(req: Request, res: Response) {
        try{
            const {page = 1, limit = 8} = req.query as {page: string; limit: string};
            const {productId} = req.params;

            const result = await ReviewModel.find({productId: productId}).populate("userId", "userName profilePicture").limit(+limit).skip((+page - 1)* +limit).sort({createdAt: -1}).exec();

            const total = await ReviewModel.countDocuments({productId: productId});

            response.pagination(res, result, {totalPage: Math.ceil(total / +limit), current: +page, total: total}, "success to find riview by product");

        } catch(error) {
            response.error(res, error, "failed to create review");
        }
    },

    async delete(req: IReqUser, res: Response) {
        try {
            const userId = req.user?.id;
            
            const {id} = req.params;

            if(!isValidObjectId(id)) return response.notFound(res, "review is not found");

            
            const review = await ReviewModel.findOneAndDelete({_id: id, userId: userId});

            if(!review) return response.notFound(res, "review is not found");

            const product = await ProductModel.findById(review.productId);

            if(!product) return response.notFound(res, "product is not found");

            const oldTotalComment = product.totalComment ?? 0;
            const oldAvg = product.starsAgr ?? 0;

            const totalStars = oldAvg * oldTotalComment;

            const newTotalComment = oldTotalComment - 1;
            const newTotalStars = totalStars - review.stars
            
            if(newTotalComment <= 0) {
                product.totalComment = 0;
                product.starsAgr = 0
            } else{
                const newAvg = newTotalStars / newTotalComment;
                product.totalComment = newTotalComment;
                product.starsAgr = Number(newAvg.toFixed(2));
            }

            await product.save();

            response.success(res, review, "success to delete review");


        } catch(error) {
            response.error(res, error, "failed to delete review")
        }
    }
}


export default ReviewController;