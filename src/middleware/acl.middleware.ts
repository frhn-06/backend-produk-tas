import { NextFunction, Response } from "express"
import { IReqUser } from "../utils/interface"
import response from "../utils/response"

const aclMiddleware = (roles: string[]) => {
    return (req: IReqUser, res: Response, next: NextFunction) => {
        const role = req.user?.role;
        
        if(!role || !roles.includes(role)) {
            return response.unauthorize(res, "forbidden");
        }

        next();
        
    }
}

export default aclMiddleware