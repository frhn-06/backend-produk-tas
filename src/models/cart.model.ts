import * as yup from 'yup';
import mongoose, { ObjectId } from 'mongoose';


export const cartDTO = yup.object({
    productId: yup.string().required()
});

const schema = mongoose.Schema;

export type ICart = yup.InferType<typeof cartDTO>;

export interface Cart extends Omit<ICart, "productId"> {
    productId: ObjectId;
    userId: ObjectId;
    quantity: number
};

const cartSchema = new schema<Cart>({
    productId: {
        type: schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    userId: {
        type: schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    quantity: {
        type: schema.Types.Number,
        required: true
    }
}, {
    timestamps: true
});

cartSchema.index({
    name: "text"
}) 

const CartModel = mongoose.model("Cart", cartSchema);

export default CartModel;