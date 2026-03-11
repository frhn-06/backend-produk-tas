import mongoose from 'mongoose';
import * as yup from 'yup';
import { ROLE } from '../utils/constant';
import { encrypt } from '../utils/encryption';
import { renderHtml, sendMail } from '../utils/mail/nodemailer';
import { CLIENT_HOST, MY_EMAIL } from '../utils/env';


const password = yup.string().min(4, "must be as least a 4 characters long")
    .test('capital', 'password must be a capital', (value) => {
        if(!value) return false;
        const regex = /^(?=.*[A-Z])/;
        return regex.test(value);
    })
    .test('number', 'password must be a number', (value) => {
        if(!value) return false;
        const regex = /^(?=.*\d)/;
        return regex.test(value)
    }).required()

const confirmPassword = yup.string().oneOf([yup.ref('password'), ''], "password not match").required();

export const UserDTO = yup.object({
    fullName: yup.string().required(),
    userName: yup.string().required(),
    email: yup.string().required(),
    password: password,
    confirmPassword: confirmPassword
});


export const UpdateProfileDTO = yup.object({
    fullName: yup.string().required(),
    userName: yup.string().required(),
    profilePicture: yup.string(),
    phone: yup.string(),
    address: yup.string(),
    coordinate: yup.array().of(yup.number()).length(2),
})


export const UpdatePasswordDTO = yup.object({
    oldPassword: password,
    password: password,
    confirmPassword: confirmPassword
});


export type ILogin = {
    identifier: string;
    password: string;
}

export const LoginDTO = yup.object({
    identifier: yup.string().required(),
    password: yup.string().required(),
});


export type TypeUserForm = yup.InferType<typeof UserDTO>;

export interface IUser extends Omit<TypeUserForm, "confirmPassword"> {
    isActive: boolean;
    activationCode: string;
    role: string;
    profilePicture: string;
    createdAt?: string;
    phone: string;
    address: string;
    coordinate: number[]
}
 


const schema = mongoose.Schema;

const userSchema = new schema<IUser>({
    fullName: {
        type: schema.Types.String,
        required: true
    },
    userName: {
        type: schema.Types.String,
        required: true,
        unique: true
    },
    email: {
        type: schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: schema.Types.String,
        required: true
    },
    isActive: {
        type: schema.Types.Boolean,
        default: false
    },
    activationCode : {
        type: schema.Types.String,
    },
    role: {
        type: schema.Types.String,
        enum: [ROLE.ADMIN, ROLE.MEMBER],
        default : ROLE.MEMBER
    },
    profilePicture: {
        type: schema.Types.String,
        default: "user.jpg"
    },
    phone: {
        type: schema.Types.String,
        default: ""
    },
    address: {
        type: schema.Types.String,
        default: ""
    },
    coordinate: {
        type: [schema.Types.Number],
        default: [0,0]
    }
}, {
    timestamps: true
});


userSchema.pre('save', function(next) {
    const user = this;
    user.password = encrypt(user.password);
    user.activationCode = encrypt(`${user._id}`);

    next();
});


userSchema.post("save", async function(doc, next) {
    try {
        const user = doc;
    
        const html = await renderHtml("email-activation.ejs", {
            title: "Velaro",
            userName: user.userName,
            fullName: user.fullName,
            email: user.email,
            link: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`,
            tanggal: user.createdAt
        });
    
        await sendMail({
            from: MY_EMAIL,
            to: user.email,
            subject: "Aktivasi Akun",
            html: html
        });
    
    } catch (error) {
        console.log(error);
    } finally {
        next();
    }
})


userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
}

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
