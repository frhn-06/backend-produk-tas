import mongoose, { ObjectId, Schema } from 'mongoose';
import * as yup from 'yup';

export const productDTO = yup.object({
    name: yup.string().required(),
    slug: yup.string(),
    description: yup.string().required(),
    categoryId: yup.string().required(),
    createdBy: yup.string().required(),
    quantity: yup.number().required(),
    price: yup.number().min(1000).required(),
    discount: yup.number().min(0).max(100),
    isPublish: yup.boolean(),
    isFeatured: yup.boolean(),
    isDeleted: yup.boolean(),
    image: yup.string().required(),
    images: yup.array(yup.string()).min(1),
    starsAgr: yup.number(),
    totalComment: yup.number(),
})

export type IProductForm = yup.InferType<typeof productDTO>

export interface Product extends Omit<IProductForm, "categoryId" | "createdBy"> {
    categoryId: ObjectId,
    createdBy: ObjectId
}



const schema = mongoose.Schema;


const productSchema = new Schema<Product>({
    name: {
        type: schema.Types.String,
        required: true
    },
    slug: {
        type: schema.Types.String,
        unique: true,
        index: true
    },
    description: {
        type: schema.Types.String,
        required: true
    },
    categoryId: {
        type: schema.Types.ObjectId,
        required: true,
        ref: "Category"
    },
    createdBy: {
        type: schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    price: {
        type: schema.Types.Number,
        required: true,
        min: 1000
    },
    discount: {
        type: schema.Types.Number,
        default: 0
    },
    quantity: {
        type: schema.Types.Number,
        required: true,
        min: 0
    },
    isPublish: {
        type: schema.Types.Boolean,
        default: true
    },
    isFeatured: {
        type: schema.Types.Boolean,
        default: false
    },
    isDeleted: {
        type: schema.Types.Boolean,
        default: false
    },
    image: {
        type: schema.Types.String,
        required: true
    },
    images: {
        type: [schema.Types.String],
        default: []
    },
    starsAgr: {
        type: schema.Types.Number,
        default: 0
    },
    totalComment: {
        type: schema.Types.Number,
        default: 0
    }
}, {
    timestamps: true
});


productSchema.pre("save", function(next) {
    const product = this;
    if(!product.slug) {
        const slug = product.name.split(' ').join('-').toLowerCase();
        product.slug = `${slug}`;
    }
    next();
})

productSchema.index({
    name: "text",
    description: "text"
});


const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;