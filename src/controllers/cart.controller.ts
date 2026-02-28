import { IReqUser } from "../utils/interface";
import { Request, Response } from "express";
import response from "../utils/response";
import { FilterQuery, isValidObjectId } from "mongoose";
import ProductModel from "../models/product.model";
import CartModel, { Cart, cartDTO } from "../models/cart.model";

const cartController = {
    async create(req: IReqUser, res: Response) {
        try {
            const validate = await cartDTO.validate(req.body);

            if(!isValidObjectId(validate.productId)) return response.notFound(res, "product not found");

            const validatedProduct = await ProductModel.findById(validate.productId);

            if(!validatedProduct) return response.notFound(res, "product not found");

            const cartSudah = await CartModel.findOne({
                productId: validate.productId
            });

            if(cartSudah) {
                cartSudah.quantity += 1;
                await cartSudah.save();

                return response.success(res, cartSudah, "success to create cart");
            }

            const payload = {
                ...validate,
                userId: req.user?.id,
                name: validatedProduct.name,
                price: validatedProduct.price,
                image: validatedProduct.image,
                quantity: 1
            }

            const result = await CartModel.create(payload);

            response.success(res, result, "success to create cart");
        }catch(error) {
            response.error(res, error, "failed to create cart");
        }
    },

    async findAll(req: IReqUser, res: Response) {
        try {
            const {search} = req.query as {search?: string}

            const buildQuery = (search?: string) => {
                let query: FilterQuery<Cart> = {};
                if(search) {
                    query.$text = {$search: search}
                }

                return query
            }

            const query = buildQuery(search);

            const result = await CartModel.find({userId: req.user?.id, ...query}).sort({updateAt: -1}).exec();

            const total = await CartModel.countDocuments();

            response.pagination(res, result, {current: 1, total: +total, totalPage: 1}, "success to find all cart");
        }catch(error) {
            response.error(res, error, "failed to find all cart");
        }
    },

    async findById(req: IReqUser, res: Response) {
        try {
            const {id} = req.params;

            if(!isValidObjectId(id)) return response.notFound(res, "cart is not found");

            const result = await CartModel.findById(id);

            if(!result) return response.notFound(res, "cart is not found");

            response.success(res, result, "success to find one cart");
        } catch(error) {
            response.error(res, error, "failed to find one cart");
        }
    },

    async delete(req: IReqUser, res: Response) {
        try {
            const {id} = req.params;

            if(!isValidObjectId(id)) return response.notFound(res, "cart is not found");

            const result = await CartModel.findByIdAndDelete(id);

            response.success(res, result, "success to delete cart")
        }catch(error) {
            response.error(res, error, "failed to delete cart");
        }
    },
}

export default cartController;