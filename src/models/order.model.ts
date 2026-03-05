// import * as yup from 'yup';
// import mongoose, { ObjectId } from 'mongoose';
// import { TyperesponseMidtrans } from '../utils/payment';


// export const orderDTO = yup.object({
//     products: yup.array().of(yup.object({productId: yup.string(), quantity: yup.string()})).min(1, "at least one product is required").required()
// });

// const schema = mongoose.Schema;

// export type IOrder = yup.InferType<typeof orderDTO>;


// interface Order extends Omit<IOrder, "userId" | "productId">{
//     orderId: string;
//     userId: ObjectId;
//     productId: ObjectId;
//     status: string;
//     total: number;
//     payment: TyperesponseMidtrans;
// };

// const orderSchema = new schema<Order>({
//     orderId: {
//         type: schema.Types.String,
//     },
//     productId: {
//         type: schema.Types.ObjectId,
//         ref: "Product",
//         required: true
//     },
//     userId: {
//         type: schema.Types.ObjectId,
//         ref: "User",
//         required: true
//     },
//     quantity: {
//         type: schema.Types.Number,
//         required: true
//     },
//     status: {
//         type: schema.Types.String,
//         enum: ["success", "pending", "canceled"],
//         default: "pending"
//     },
//     total: {
//         type: schema.Types.Number,
//         required: true
//     },
//     payment: {
//         type: {
//             token: {
//                 type: schema.Types.String,
//                 required: true
//             },
//             redirect_url: {
//                 type: schema.Types.String,
//                 required: true
//             }
//         }
//     }
// }, {
//     timestamps: true
// });


// const OrderModel = mongoose.model("Order", orderSchema);

// export default OrderModel;