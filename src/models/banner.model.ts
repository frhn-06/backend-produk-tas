import mongoose from 'mongoose';
import * as yup from 'yup';

export const bannerDTO = yup.object({
    name: yup.string().required(),
    image: yup.string().required(),
    description: yup.string().required()
});

export type IBannerForm = yup.InferType<typeof bannerDTO>;


const schema = mongoose.Schema;

const bannerSchema = new schema<IBannerForm>({
    name: {
        type: schema.Types.String,
        required: true
    },
    image: {
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


bannerSchema.index({name: "text"});


const BannerModel = mongoose.model("Banner", bannerSchema);

export default BannerModel;