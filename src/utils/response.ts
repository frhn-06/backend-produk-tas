import { Response } from "express"
import mongoose from "mongoose"
import * as yup from "yup"
import { IPagination } from "./interface"

export default {
    success(res: Response, data: any, message: string) {
        return res.status(200).json({
            meta: {
                status: 200,
                message: message
            },
            data: data
        })
    },
    error(res: Response, error: unknown, message: string) {
        if(error instanceof yup.ValidationError) {
            return res.status(400).json({
                meta: {
                    status: 400,
                    message: error.message
                },
                data: {
                    [`${error.path}`] : error.errors
                }
            });
        }

        if(error instanceof mongoose.Error) {
            return res.status(300).json({
                meta: {
                    status: 400,
                    message: error.message
                },
                data: error.name
            });
        }

        if((error as any)?.code) {
            const err = error as any;
            return res.status(500).json({
                meta: {
                    status: 500,
                    message: err.errorResponse.errmsg
                },
                data: err
            });
        }


        return res.status(500).json({
            meta: {
                status: 500,
                message: message
            },
            data: error
        })
    },
    notFound(res: Response, message: string) {
        return res.status(404).json({
            meta: {
                status: 404,
                message: message
            },
        })
    },
    unauthorize(res: Response, message?: string) {
        return res.status(401).json({
            meta: {
                status: 401,
                message: message || "unauthorized"
            }
        })
    },
    pagination(res: Response, data: any[], pagination: IPagination, message: string) {
        return res.status(200).json({
            meta: {
                status: 200,
                message: message
            },
            data: data,
            pagination: pagination
        })
    }
}