import * as yup from 'yup'

import mongoose, { ObjectId } from 'mongoose';

export const reviewDTO = yup.object({
    productId: yup.string().required(),
    comment: yup.string().required(),
    stars: yup.number().required().min(1).max(5)
});


const schema = mongoose.Schema;

export type IReviewForm = yup.InferType<typeof reviewDTO>;

interface Review extends Omit<IReviewForm, "productId"> {
    productId: ObjectId;
    userId: ObjectId;
}


const reviewSchema = new schema<Review>({
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
    comment: {
        type: schema.Types.String,
        required: true,
        trim: true
    },
    stars: {
        type: schema.Types.Number,
        required: true,
        min: 1,
        max: 5
    },
}, {
    timestamps: true
});

reviewSchema.index({
    productId: 1,
    userId: 1
}, {
    unique: true
});

const ReviewModel = mongoose.model("Review", reviewSchema);

export default ReviewModel;