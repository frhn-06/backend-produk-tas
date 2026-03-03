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

            const product = await ProductModel.findById(validate.productId);

            if(!product) return response.notFound(res, "product not found");

            if(product.quantity <= 0) return response.error(res, null, "product is empty");

            const cartSudahAda = await CartModel.findOne({
                productId: validate.productId,
                userId: req.user?.id
            });

            if(cartSudahAda) {
                if(cartSudahAda.quantity + 1 > product.quantity) return response.error(res, null, "product is empty");

                cartSudahAda.quantity += 1;
                await cartSudahAda.save();

                return response.success(res, cartSudahAda, "success to create cart");
            }

            const payload = {
                ...validate,
                userId: req.user?.id,
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

            const result = await CartModel.find({userId: req.user?.id, ...query}).populate('productId', 'name price image').sort({createdAt: -1}).exec();

            const total = await CartModel.countDocuments({userId: req.user?.id, ...query});

            response.pagination(res, result, {current: 1, total: +total, totalPage: 1}, "success to find all cart");
        }catch(error) {
            response.error(res, error, "failed to find all cart");
        }
    },

    async findById(req: IReqUser, res: Response) {
        try {
            const {id} = req.params;

            if(!isValidObjectId(id)) return response.notFound(res, "cart is not found");

            const result = await CartModel.findOne({
                productId: id,
                userId: req.user?.id
            });

            if(!result) return response.notFound(res, "cart is not found");

            response.success(res, result, "success to find one cart");
        } catch(error) {
            response.error(res, error, "failed to find one cart");
        }
    },

    async plus(req: IReqUser, res: Response) {
        try {
            const {id} = req.params;

            if(!isValidObjectId(id)) return response.notFound(res, "cart is not found");

            const cart = await CartModel.findOne({
                productId: id,
                userId: req.user?.id
            });

            if (!cart) return response.notFound(res, "cart is not found");

            const product = await ProductModel.findById(cart.productId);

            if(!product) return response.notFound(res, "product is not found");

            if (cart.quantity + 1 > product.quantity ) return response.error(res, null, "product is tidak cukup");

            cart.quantity += 1;
            await cart.save();

            response.success(res, cart, "success to plus quantity cart");

        } catch(error) {
            response.error(res, error, "failed to plus quantity cart");   
        }
    },

    async min(req: IReqUser, res: Response) {
        try {
            const {id} = req.params;

            if(!isValidObjectId(id)) return response.notFound(res, "cart is not found");

            const cart = await CartModel.findOne({
                productId: id,
                userId: req.user?.id
            });

            if (!cart) return response.notFound(res, "cart is not found");

            if (cart.quantity <= 1 ) return response.error(res, null, "cart is not found");

            cart.quantity -= 1;
            await cart.save();

            response.success(res, cart, "success to min quantity cart");

        } catch(error) {
            response.error(res, error, "failed to min quantity cart");   
        }
    },

    async delete(req: IReqUser, res: Response) {
        try {
            const {id} = req.params;

            if(!isValidObjectId(id)) return response.notFound(res, "cart is not found");

            const result = await CartModel.findOneAndDelete({
                productId: id,
                userId: req.user?.id
            });

            response.success(res, result, "success to delete cart")
        }catch(error) {
            response.error(res, error, "failed to delete cart");
        }
    },
}

export default cartController;