import { Request, Response , NextFunction } from "express";
import response from "../utils/response";
import { getUserData } from "../utils/jwt";
import { IReqUser } from "../utils/interface";

const verificationToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorize = req.headers.authorization;
    
        if(!authorize) {
            return response.unauthorize(res);
        }
    
        const [bearer, token] = authorize.split(' ');
        if(bearer !== 'Bearer' && !token) {
            return response.unauthorize(res);
        }
    
        const result = getUserData(token);
    
        (req as IReqUser).user = result
    
        next();
    }catch(error) {
        console.log(error);
    }
}

export default verificationToken;