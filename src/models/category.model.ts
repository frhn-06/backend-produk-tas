import mongoose from 'mongoose';
import * as yup from 'yup';

export const categoryDTO = yup.object({
    name: yup.string().required(),
    icon: yup.string().required(),
    description: yup.string().required()
});

export type ICategoryForm = yup.InferType<typeof categoryDTO>;


const schema = mongoose.Schema;

const categorySchema = new schema<ICategoryForm>({
    name: {
        type: schema.Types.String,
        required: true
    },
    icon: {
        type: schema.Types.String,
        requied: true
    },
    description: {
        type: schema.Types.String,
        required: true
    }
}, {
    timestamps: true
});


categorySchema.index({name: "text"});


const CategoryModel = mongoose.model("Category", categorySchema);

export default CategoryModel;