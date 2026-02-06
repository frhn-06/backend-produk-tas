import { NextFunction, Request, Response } from "express"
import response from "../utils/response"

const errorMiddleware = {
    severRoute() {
        return (req: Request, res: Response, next: NextFunction) => {
            response.notFound(res, "route not found")
        }
    },
    serverError() {
        return (err: Error, req: Request, res:Response, next: NextFunction) => {
            response.error(res, err, err.message);
        }
    }
}

export default errorMiddleware;