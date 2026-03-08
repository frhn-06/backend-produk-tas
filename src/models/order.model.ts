import * as yup from 'yup';
import mongoose, { ObjectId } from 'mongoose';
import payment, { TyperesponseMidtrans } from '../utils/payment';
import { nanoid } from 'nanoid';


export const orderDTO = yup.object({
    products: yup.array().of(yup.object({
        productId: yup.string(), 
        name: yup.string(), 
        price: yup.number(), 
        quantity: yup.number()
    })).min(1, "at least one product is required").required(),
});

const schema = mongoose.Schema;

export type IOrder = yup.InferType<typeof orderDTO>;


interface IShippingAddress {
    name: string;
    phone: string;
    address: string;
    coordinate: string[]
}

export type IProductsForm = {
    productId: string;
    name: string;
    quantity: number;
    price: number;
}

interface IProduts extends Omit<IProductsForm, "productId"> {
    productId: ObjectId;
} 


export interface Order extends Omit<IOrder, "products">{
    orderId: string;
    userId: ObjectId;
    products: [IProduts];
    status: string;
    total: number;
    shippingAddress: IShippingAddress;
    payment: TyperesponseMidtrans;
};

export enum orderStatus {
    PENDING= "pending", 
    COMPLETED= "completed",
    CANCELLED= "cancelled",
    PAID= "settlement",
    EXPIRE= "expired"
}

const orderSchema = new schema<Order>({
    orderId: {
        type: schema.Types.String,
        unique: true,
    },
    products: {
        type: [{
            productId: {
                type: schema.Types.ObjectId,
                required: true,
                ref: "Product"
            },
            name: {
                type: schema.Types.String,
                required: true
            },
            price: {
                type: schema.Types.Number,
                required: true
            },
            quantity: {
                type: schema.Types.Number,
                required: true
            }
        }]
    },
    userId: {
        type: schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    status: {
        type: schema.Types.String,
        enum: [orderStatus.COMPLETED, orderStatus.CANCELLED, orderStatus.PENDING, orderStatus.EXPIRE],
        default: orderStatus.PENDING
    },
    total: {
        type: schema.Types.Number,
        required: true
    },
    shippingAddress: {
        type: {
            name: {
                type: schema.Types.String,
                required: true
            },
            phone: {
                type: schema.Types.String,
                required: true
            },
            address: {
                type: schema.Types.String,
                required: true
            },
            coordinate: {
                type: [schema.Types.String],
                required: true
            },
        }
    },
    payment: {
        type: {
            token: {
                type: schema.Types.String,
                required: true
            },
            redirect_url: {
                type: schema.Types.String,
                required: true
            }
        }
    }
}, {
    timestamps: true
});


orderSchema.pre("save", async function() {
    if(!this.isNew) return;

    const order = this;
    order.orderId = nanoid();
    order.payment = await payment.createLink({
        transaction_details: {
            order_id: order.orderId,
            gross_amount: order.total
        }
    });
});




const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;