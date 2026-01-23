import { Types } from "mongoose";
import { IUser } from "../models/user.model";
import { Request } from "express";


export interface IUserToken extends Omit<IUser, "fullName" | "userName" | "password" | "email" | "isActive" | "activationCode" | "address" | "coordinate" | "profilePicture"> {
    id? : Types.ObjectId;
}


export interface IReqUser extends Request {
    user?: IUserToken;
}

