import { Request, Response } from "express"
import response from '../utils/response'
import UserModel, { ILogin, LoginDTO, TypeUserForm, UserDTO } from "../models/user.model"
import { encrypt } from "../utils/encryption";
import { signIn } from "../utils/jwt";
import { IReqUser } from "../utils/interface";
import { isValidObjectId } from "mongoose";


export default {
    async register(req: Request, res: Response ) {
        try {
            const {userName, fullName, email,  password, confirmPassword} = req.body;

            await UserDTO.validate({userName, fullName, email, password, confirmPassword});

            const duplicate = await UserModel.findOne({
                $or: [
                    {userName : userName},
                    {email: email}
                ]
            });

            if(duplicate) {
                return response.error(res, 400, "userName or email already owned");
            }

            const result = await UserModel.create({userName, email, fullName, password});

            response.success(res, result, "success to registration");

        } catch (error) {
            response.error(res, error, "failed to registrastion");
        }
    },

    async activation(req: Request, res: Response) {
        try {
            const {code} = req.body as {code: string};
            
            const result = await UserModel.findOneAndUpdate({
                activationCode: code
            }, {
                isActive: true
            },{
                new: true
            });

            response.success(res, result, "success to actived");

        } catch (error) {
            response.error(res, error, "failed to actived");
        }
    },

    async login(req: Request, res: Response) {
        try {
            const {identifier, password} = req.body as ILogin;

            // console.log({identifier, password});

            await LoginDTO.validate({identifier, password});

            const data = await UserModel.findOne({
                $or : [
                    {
                        email: identifier
                    },
                    {
                        userName: identifier
                    }
                ],
                isActive: true
            });

            if(!data) {
                return response.error(res, null, "user not found");
            }

            
            const passwordMatch: boolean = data.password === encrypt(password);
            if(!passwordMatch) {
                return response.error(res, null,"your password is wrong");
            }
        
            const token = signIn({
                role: data.role,
                id: data._id
            });

            response.success(res, token, "user success to login");
            
        } catch (error) {
            response.error(res, error, "failed to login")
        }
    },

    async me(req: IReqUser, res: Response) {
        try {
            const user = await UserModel.findById(req.user?.id);

            if(!user) {
                return response.unauthorize(res);
            }

            response.success(res, user, "success get me");

        } catch (error) {
            return response.error(res, null, "failed to get me");
        }
    },

    async user(req: IReqUser, res: Response) {
        try {
            const {id} = req.params;
            
            if(!isValidObjectId(id)) return response.notFound(res, "user not found");

            const result = await UserModel.findById(id);

            response.success(res, result, "success to get user");
        } catch(error) {
            return response.error(res, null, "failed to get user");
        }
    }
}