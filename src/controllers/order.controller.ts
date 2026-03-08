import response from "../utils/response";
import { IReqUser } from "../utils/interface";
import { Request, Response } from "express";
import OrderModel, { IOrder, IProductsForm, Order, orderDTO, orderStatus } from "../models/order.model";
import { FilterQuery, isValidObjectId } from "mongoose";
import ProductModel from "../models/product.model";
import UserModel from "../models/user.model";

const orderController = {
    async create(req: IReqUser, res: Response) {
        try {
            const validate = await orderDTO.validate(req.body);

            validate.products.forEach(item => {
                if (!isValidObjectId(item.productId)) {
                    throw new Error("invalid productId");
                }
            })

            const productsIdForm = req.body.products.map((p: IProductsForm) => p.productId as string);

            const dbProducts = await ProductModel.find({
                _id: { $in: productsIdForm }
            })

            const orderProductsFinal = req.body.products.map((item: IProductsForm) => {
                const product = dbProducts.find(p => p._id.toString() === item.productId);

                if (!product) {
                    throw new Error("product not found");
                }

                const discount = product.discount || 0;

                const realPrice = product.price - (product.price * discount / 100);

                return {
                    productId: product._id,
                    name: product.name,
                    price: realPrice,
                    quantity: item.quantity
                }
            });

            const total = orderProductsFinal.reduce((n: number, p: IProductsForm) => {
                return n + (p.price * p.quantity);
            }, 0)


            const user = await UserModel.findById(req.user?.id);

            const finalPayload = {
                products: orderProductsFinal,
                userId: req.user?.id,
                total: total,
                shippingAddress: {
                    name: user?.fullName,
                    phone: user?.phone,
                    address: user?.address,
                    coordinate: user?.coordinate
                }
            }

            const result = await OrderModel.create(finalPayload);

            response.success(res, result, "success to create order");

        } catch (error) {
            response.error(res, error, "failed to create order");
        }
    },

    async findAll(req: IReqUser, res: Response) {
        const { page = 1, limit = 8, status } = req.query as { page: string | number, limit: string | number, status: string };

        try {
            
            const BuildQuery = (status?: string) => {
                let queryAwal: FilterQuery<Order> = {};

                if (status) queryAwal.status = status;

                return queryAwal;
            }

            const query = BuildQuery(status)

            const result = await OrderModel.find(query).limit(+limit).skip((+page - 1) * +limit).sort({ createdAt: -1 }).exec();

            const total = await OrderModel.countDocuments(query);

            response.pagination(res, result, { current: +page, totalPage: Math.ceil(+total / +limit), total: +total }, "success to find all orders");

        } catch (error) {
            response.error(res, error, "failed to find an order by id");
        }
    },

    async findById(req: IReqUser, res: Response) {
        const { id } = req.params;

        try {

            if (!isValidObjectId(id)) return response.notFound(res, "order is not found");

            const result = await OrderModel.findById(id);

            if (!result) return response.notFound(res, "order is not found");

            response.success(res, result, "success to find a order")

        } catch (error) {
            response.error(res, error, "failed to find an order by id");
        }
    },

    async findByUser(req: IReqUser, res: Response) {
        const { page = 1, limit = 8, status } = req.query as { page: string | number, limit: string | number, status: string };
        try {
            if (!req.user?.id) return response.unauthorize(res, "unauthorized");

            const id = req.user?.id;

            const BuildQuery = (status?: string) => {
                let queryAwal: FilterQuery<Order> = { userId: id };

                if (status) queryAwal.status = status;

                return queryAwal;
            }

            const query = BuildQuery(status)

            const result = await OrderModel.find(query).limit(+limit).skip((+page - 1) * +limit).sort({ createdAt: -1 }).exec();

            const total = await OrderModel.countDocuments(query);

            response.pagination(res, result, { current: +page, totalPage: Math.ceil(+total / +limit), total: +total }, "success to find all orders by userId");


        } catch (error) {
            response.error(res, error, "failed to find all orders by userId");
        }
    },

    async remove(req: IReqUser, res: Response) {
        const { id } = req.params;

        try {
            if (!isValidObjectId(id)) return response.notFound(res, "order not found")

            const result = await OrderModel.findByIdAndDelete(id);

            if (!result) return response.notFound(res, "order is not found");

            response.success(res, result, "success to remove order");

        } catch (error) {
            response.error(res, error, "failed to remove order");
        }
    },

    async webhook(req: Request, res: Response) {
        try {
            console.log(req.body);

            const { order_id, transaction_status } = req.body as any;

            const order = await OrderModel.findOne({ orderId: order_id });

            if (!order) {
                return response.notFound(res, "order not found");
            }

            let status = "pending";

            if (transaction_status === "settlement") {
                status = "settlement"
            }

            if (transaction_status === "cancel") {
                status = "cancelled"
            }

            if (transaction_status === "expire") {
                status = "expired";
            }

            await OrderModel.findOneAndUpdate({orderId: order_id}, {
                status: status
            }, {new: true})

            response.success(res, null, "webhook received");

        } catch (error) {
            response.error(res, error, "webhook error");
        }
    },

    async completed(req: IReqUser, res: Response) {
        const { id } = req.params;

        try {
            if (!isValidObjectId(id)) return response.notFound(res, "order not found")

            const result = await OrderModel.findByIdAndUpdate(id, {
                status: orderStatus.COMPLETED
            }, {
                new: true
            });

            if (!result) return response.notFound(res, "order is not found");

            response.success(res, result, "success to completed order");
        } catch (error) {
            response.error(res, error, "failed to completed order");
        }
    },

    async cancelled(req: IReqUser, res: Response) {
        const { id } = req.params;

        try {
            if (!isValidObjectId(id)) return response.notFound(res, "order not found")

            const result = await OrderModel.findByIdAndUpdate(id, {
                status: orderStatus.CANCELLED
            }, {
                new: true
            });

            if (!result) return response.notFound(res, "order is not found");

            response.success(res, result, "success to cancel order");
        } catch (error) {
            response.error(res, error, "failed to cancel order");
        }
    }
}



export default orderController;