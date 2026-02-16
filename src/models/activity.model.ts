import * as yup from 'yup';
import mongoose from 'mongoose';


export const activityDTO = yup.object({
    name: yup.string().required(),
    image: yup.string().required(),
});

const schema = mongoose.Schema;

export type IActivity = yup.InferType<typeof activityDTO>;

interface Activity extends IActivity{};

const activitySchema = new schema<Activity>({
    name: {
        type: schema.Types.String,
        required: true
    },
    image: {
        type: schema.Types.String,
        required: true
    }
}, {
    timestamps: true
});


const ActivityModel = mongoose.model("Activity", activitySchema);

export default ActivityModel;