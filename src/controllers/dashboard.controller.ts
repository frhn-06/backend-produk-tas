import { Response } from "express";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import ProductModel from "../models/product.model";
import UserModel from "../models/user.model";
import CategoryModel from "../models/category.model";
import OrderModel from "../models/order.model";
import CartModel from "../models/cart.model";
import { ObjectId, Types } from "mongoose";

const dashboardController = {
    async dashboardAdmin(req:IReqUser, res:Response) {
        try {
            const totalProducts = await ProductModel.countDocuments({isDeleted: false, isPublish:true});

            const totalUsers = await UserModel.countDocuments({isActive: true, role: "member"});

            const totalCategories = await CategoryModel.countDocuments();

            const totalOrders = await OrderModel.countDocuments();
            
            const SuccessOrders = await OrderModel.countDocuments({status: "settlement"});

            const pendingOrders = await OrderModel.countDocuments({status: "pending"});

            const recentSuccessOrder = await OrderModel.aggregate([
                {
                    $match: {status: "settlement"}
                },
                {
                    $group: {
                        _id: null,
                        total: {$sum: "$total"}
                    }
                }
            ])

            const recentPendidngOrder = await OrderModel.aggregate([
                {
                    $match: {status: "pending"}
                },
                {
                    $group: {
                        _id: null,
                        total: {$sum: "$total"}
                    }
                }
            ]);

            response.success(res, {
                totalProducts,
                totalOrders,
                totalCategories,
                totalUsers,
                pendingOrders,
                SuccessOrders,
                recentPendidngOrder,
                recentSuccessOrder
            }, "success to get dashboard");
            
        } catch(error) {
            response.error(res, error, "failed to get data dashboard");
        }
    },

    async dashboardMember(req: IReqUser, res:Response) {
        try {
            const totalOrders = await OrderModel.countDocuments({userId: req.user?.id});

            const successOrders = await OrderModel.countDocuments({userId: req.user?.id, status: "settlement"});

            const pendingOrders = await OrderModel.countDocuments({userId: req.user?.id, status: "pending"});

            const recentSuccessOrder = await OrderModel.aggregate([
                {
                    $match: {
                        userId: new Types.ObjectId(req.user?.id),
                        status: "settlement"
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: {$sum: "$total"}
                    }
                }
            ])

            const recentPendidngOrder = await OrderModel.aggregate([
                {
                    $match: {
                        userId: new Types.ObjectId(req.user?.id),
                        status: "pending"
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {$sum: "$total"}
                    }
                }
            ])

            const carts = await CartModel.find({userId: req.user?.id}).populate("productId", "name price image").sort({createdAt: -1}).exec();

            const totalCarts = await CartModel.countDocuments({userId: req.user?.id});

            response.success(res, {
                totalOrders,
                successOrders,
                pendingOrders,
                recentSuccessOrder,
                recentPendidngOrder,
                carts,
                totalCarts
            }, "success to get data dashboard");
        } catch(error) {
            response.error(res, error, "failed to get data dashboard member")
        }
    }
}



export default dashboardController;